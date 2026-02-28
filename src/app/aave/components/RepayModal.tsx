'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {useEffect, useState} from 'react'
import {bigDecimal, chainId as aaveChainId, evmAddress, useRepay} from '@aave/react'
import {useSendTransaction} from '@aave/react/privy'
import {fetchBalance} from '@/src/utils/balance'
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
    const {chainId, wallet, walletAddress} = useWeb3Auth()

    useEffect(() => {
        if (!isOpen) {
            setAmount('')
            setTokenBalance(null)
            setTxHash(null)
            setTxError(null)
        }
    }, [isOpen])
    useEffect(() => {
        if (!isOpen || !asset || !walletAddress || !wallet) {
            return
        }

        setIsLoadingBalance(true)
        try {
            fetchBalance(walletAddress, asset.address).then(setTokenBalance)
        } catch (e) {
            console.error('Error fetching balance:', e)
            setTokenBalance(null)
        } finally {
            setIsLoadingBalance(false)
        }
    }, [asset, isOpen, wallet, walletAddress])

    if (!isOpen || !asset || !wallet) return null

    const isExceedingBalance = tokenBalance && amount !== '' ? parseFloat(amount) > parseFloat(tokenBalance.formatted) : false

    const confirmHandler = async () => {
        if (!asset || !asset.address || !asset.market || !chainId || !walletAddress) {
            return
        }

        setTxError(null)
        setTxHash(null)
        const result = await repay({
            market: evmAddress(asset.market.address),
            chainId: aaveChainId(chainId),
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

    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Repay {asset.symbol}</h3>
                <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Your Debt</span>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                            </span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Wallet Balance</span>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {isLoadingBalance ? '...' : (tokenBalance ? `${tokenBalance.formatted} ${asset.symbol}` : '0.00')}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border ${isExceedingBalance ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                onClick={maxHandler}
                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                            >Max</button>
                            <span className="text-sm font-semibold text-zinc-500">{asset.symbol}</span>
                        </div>
                    </div>
                    {isExceedingBalance && (
                        <p className="text-xs text-red-500 mt-1">Insufficient wallet balance</p>
                    )}
                </div>
                <button
                    onClick={confirmHandler}
                    disabled={!amount || parseFloat(amount) <= 0 || isExceedingBalance || repaying.loading || sending.loading || !!txHash}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2"
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
                    <p className="text-center text-xs text-green-500 font-medium">
                        Transaction sent: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                )}
                {txError && (
                    <p className="text-center text-xs text-red-500 font-medium">
                        Error: {txError}
                    </p>
                )}
            </div>
        </div>
    </div>
}

export default RepayModal
