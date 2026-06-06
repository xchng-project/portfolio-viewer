'use client'

import {bigDecimal, chainId as aaveChainId, evmAddress, useWithdraw} from '@aave/react'
import {useSendTransaction} from '@aave/react/ethers'
import {useWeb3Auth} from '@xchng/web3-auth'
import {useState} from 'react'
import {formatBalance} from '@/src/utils/functions'
import {Asset} from './Assets'

interface Props {
    isOpen: boolean
    onClose: () => void
    asset: Omit<Asset, 'apy'> | null
}

const WithdrawModal = ({asset, isOpen, onClose}: Props) => {
    const [withdraw, withdrawing] = useWithdraw()
    const [amount, setAmount] = useState<string>('')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [txError, setTxError] = useState<string | null>(null)
    const {signer, wallet, walletAddress} = useWeb3Auth()
    const [sendTransaction, sending] = useSendTransaction(signer!)

    if (!isOpen || !asset || !wallet || !signer) return null

    const isExceedingSupply = amount !== '' ? parseFloat(amount) > parseFloat(asset.balance) : false

    const closeHandler = () => {
        setAmount('')
        setTxHash(null)
        setTxError(null)
        onClose()
    }

    const confirmHandler = async () => {
        if (!asset || !asset.address || !asset.market || !walletAddress) {
            return
        }

        setTxError(null)
        setTxHash(null)
        const result = await withdraw({
            market: evmAddress(asset.market.address),
            chainId: aaveChainId(asset.market.chainId),
            amount: {
                erc20: {
                    value: {exact: bigDecimal(amount)},
                    currency: evmAddress(asset.address),
                },
            },
            sender: evmAddress(walletAddress),
            recipient: evmAddress(walletAddress),
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
            console.error('Withdraw error:', result.error)
            setTxError(result.error instanceof Error ? result.error.message : 'Unknown error occurred')
            return
        }

        setTxHash(result.value)
        setTimeout(() => {
            closeHandler()
        }, 3000)
    }

    const maxHandler = () => {
        setAmount(asset.balance)
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
        <div
            className="w-full max-w-md overflow-hidden rounded-2xl border bg-surface"
        >
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Withdraw {asset.symbol}</h3>
                    <p className="mt-1 text-xs text-muted">{asset.name}</p>
                </div>
                <button
                    onClick={closeHandler}
                    aria-label="Close withdraw dialog"
                    className="rounded-lg p-1 text-muted hover:bg-surface-subtle hover:text-foreground"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-4">
                    <div className="rounded-xl bg-surface-subtle p-3">
                        <span className="mb-1 block text-xs font-medium text-muted">Your supply</span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                            {formatBalance(asset.balance)} {asset.symbol}
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full rounded-xl border bg-surface-subtle px-4 py-3 font-mono text-foreground placeholder:text-muted focus:border-primary focus:outline-none ${isExceedingSupply ? 'border-danger' : ''}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                onClick={maxHandler}
                                className="ui-button ui-button-compact min-h-0 px-2 py-1"
                            >Max</button>
                            <span className="text-sm font-semibold text-muted">{asset.symbol}</span>
                        </div>
                    </div>
                    {isExceedingSupply && (
                        <p className="mt-1 text-xs font-medium text-danger">Amount exceeds supplied balance</p>
                    )}
                </div>
                <button
                    onClick={confirmHandler}
                    disabled={!amount || parseFloat(amount) <= 0 || isExceedingSupply || withdrawing.loading || sending.loading || !!txHash}
                    className="ui-button ui-button-primary ui-button-wide disabled:opacity-55"
                >
                    {(withdrawing.loading || sending.loading) && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {txHash ? 'Withdraw Successful' : (withdrawing.loading || sending.loading ? 'Processing...' : 'Confirm Withdraw')}
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

export default WithdrawModal
