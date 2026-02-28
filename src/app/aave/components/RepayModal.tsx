'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {parseUnits} from 'ethers'
import {useEffect, useState} from 'react'
import {fetchBalance} from '@/src/utils/balance'
import {TokenBalance} from '@/src/utils/types'

interface Props {
    isOpen: boolean
    onClose: () => void
    asset: {
        symbol: string
        balance: string
        name: string
        address?: string
    } | null
}

const RepayModal = ({asset, isOpen, onClose}: Props) => {
    const [amount, setAmount] = useState<string>('')
    const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false)
    const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null)
    const {wallet, walletAddress} = useWeb3Auth()

    useEffect(() => {
        return () => {
            setAmount('')
            setTokenBalance(null)
        }
    }, [])
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

    if (!isOpen || !asset) return null

    const isExceedingBalance = tokenBalance && amount !== '' ? parseFloat(amount) > parseFloat(tokenBalance.formatted) : false
    const confirmHandler = () => {
        console.log(parseUnits(amount, tokenBalance?.decimals))
        onClose()
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
                    disabled={!amount || parseFloat(amount) <= 0 || isExceedingBalance}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >Confirm Repay</button>
            </div>
        </div>
    </div>
}

export default RepayModal
