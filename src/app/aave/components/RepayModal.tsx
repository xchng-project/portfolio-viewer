'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {useEffect, useState} from 'react'
import {bigDecimal, chainId as aaveChainId, evmAddress, useRepay} from '@aave/react'
import {useSendTransaction} from '@aave/react/privy'
import {fetchBalance} from '@/src/utils/balance'
import {formatBalance} from '@/src/utils/functions'
import {TokenBalance} from '@/src/utils/types'
import {Asset} from './Assets'

interface Props {
    isOpen: boolean
    onClose: () => void
    asset: Omit<Asset, 'apy'> | null
}

const RepayModal = ({asset, isOpen, onClose}: Props) => {
    const [repay, repaying] = useRepay()
    const [sendTransaction, sending] = useSendTransaction()
    const [amount, setAmount] = useState<string>('')
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false)
    const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)
    const [txError, setTxError] = useState<string | null>(null)
    const {wallet, walletAddress} = useWeb3Auth()

    useEffect(() => {
        if (!isOpen) {
            queueMicrotask(() => {
                setAmount('')
                setTokenBalance(null)
                setTxHash(null)
                setTxError(null)
            })
        }
    }, [isOpen])
    useEffect(() => {
        if (!isOpen || !asset || !walletAddress || !wallet) {
            return
        }

        queueMicrotask(() => {
            setIsLoadingBalance(true)
            fetchBalance(walletAddress, asset.address)
                .then(setTokenBalance)
                .catch((e) => {
                    console.error('Error fetching balance:', e)
                    setTokenBalance(null)
                })
                .finally(() => {
                    setIsLoadingBalance(false)
                })
        })
    }, [asset, isOpen, wallet, walletAddress])

    if (!isOpen || !asset || !wallet) return null

    const isExceedingBalance = tokenBalance && amount !== '' ? parseFloat(amount) > parseFloat(tokenBalance.formatted) : false

    const confirmHandler = async () => {
        if (!asset || !asset.address || !asset.market || !walletAddress) {
            return
        }

        setTxError(null)
        setTxHash(null)
        const result = await repay({
            market: evmAddress(asset.market.address),
            chainId: aaveChainId(asset.market.chainId),
            amount: {
                erc20: {
                    value: {exact: bigDecimal(amount)},
                    currency: evmAddress(asset.address),
                },
            },
            sender: evmAddress(walletAddress),
        }).andThen((plan) => {
            switch (plan.__typename) {
                case 'TransactionRequest':
                    return sendTransaction(plan)
                case 'ApprovalRequired':
                    return sendTransaction(plan.approval)
                        .andThen(() => sendTransaction(plan.originalTransaction))
                case 'InsufficientBalanceError':
                    throw new Error(`Insufficient balance: ${plan.required.value} required.`)
                default:
                    throw new Error('Unexpected execution plan')
            }
        })

        if (result.isErr()) {
            console.error('Repay error:', result.error)
            setTxError(result.error instanceof Error ? result.error.message : 'Unknown error occurred')
            return
        }

        setTxHash(result.value)
        // Optionally close after some time or keep it to show success
        setTimeout(() => {
            onClose()
        }, 3000)
    }
    const maxHandler = () => {
        if (!tokenBalance) {
            return
        }

        const maxAmount = parseFloat(asset.balance) > parseFloat(tokenBalance.formatted)
            ? tokenBalance.formatted
            : asset.balance
        setAmount(maxAmount)
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
        <div
            className="w-full max-w-md overflow-hidden rounded-2xl border bg-surface"
        >
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Repay {asset.symbol}</h3>
                    <p className="mt-1 text-xs text-muted">{asset.name}</p>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close repay dialog"
                    className="rounded-lg p-1 text-muted hover:bg-surface-subtle hover:text-foreground"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-surface-subtle p-3">
                            <span className="mb-1 block text-xs font-medium text-muted">Your debt</span>
                            <span className="font-mono text-sm font-semibold text-foreground">
                                {formatBalance(asset.balance)} {asset.symbol}
                            </span>
                        </div>
                        <div className="rounded-xl bg-surface-subtle p-3">
                            <span className="mb-1 block text-xs font-medium text-muted">Wallet balance</span>
                            <span className="font-mono text-sm font-semibold text-foreground">
                                {isLoadingBalance ? '...' : (tokenBalance ? `${formatBalance(tokenBalance.formatted)} ${asset.symbol}` : '0')}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full rounded-xl border bg-surface-subtle px-4 py-3 font-mono text-foreground placeholder:text-muted focus:border-primary focus:outline-none ${isExceedingBalance ? 'border-danger' : ''}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                onClick={maxHandler}
                                className="ui-button ui-button-compact min-h-0 px-2 py-1"
                            >Max</button>
                            <span className="text-sm font-semibold text-muted">{asset.symbol}</span>
                        </div>
                    </div>
                    {isExceedingBalance && (
                        <p className="mt-1 text-xs font-medium text-danger">Insufficient wallet balance</p>
                    )}
                </div>
                <button
                    onClick={confirmHandler}
                    disabled={!amount || parseFloat(amount) <= 0 || isExceedingBalance || repaying.loading || sending.loading || !!txHash}
                    className="ui-button ui-button-primary ui-button-wide disabled:opacity-55"
                >
                    {(repaying.loading || sending.loading) && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {txHash ? 'Repay Successful' : (repaying.loading || sending.loading ? 'Processing...' : 'Confirm Repay')}
                </button>
                {txHash && (
                    <p className="rounded-lg bg-success-soft px-3 py-2 text-center text-xs font-medium text-success">
                        Transaction sent: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                )}
                {txError && (
                    <p className="rounded-lg bg-danger-soft px-3 py-2 text-center text-xs font-medium text-danger">
                        Error: {txError}
                    </p>
                )}
            </div>
        </div>
    </div>
}

export default RepayModal
