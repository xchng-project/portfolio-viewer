'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {Suspense} from 'react'
import {ConnectWalletButton} from '@/src/app/components/wallet'
import Borrows from './Borrows'
import SupplyOptions from './SupplyOptions'
import Supplies from './Supplies'

export interface Asset {
    address?: string
    apy?: string
    balance: string
    market?: {
        address: string
        chainId: number
    }
    name: string
    symbol: string
    valueInUsd: string
}

const Assets = () => {
    const {chainId, walletAddress} = useWeb3Auth()

    return chainId && walletAddress ?
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<PanelSkeleton title="Your supplies"/>}>
                        <Supplies chainId={chainId} walletAddress={walletAddress}/>
                    </Suspense>
                    <Suspense fallback={<PanelSkeleton title="Your borrows"/>}>
                        <Borrows chainId={chainId} walletAddress={walletAddress}/>
                    </Suspense>
                </div>
                <Suspense fallback={<PanelSkeleton title="Assets to supply"/>}>
                    <SupplyOptions chainId={chainId} walletAddress={walletAddress}/>
                </Suspense>
            </div>
            :
            <div className="rounded-xl border bg-surface p-6 sm:p-8">
                <div className="max-w-xl">
                    <p className="mb-3 text-sm font-semibold text-primary">Wallet required</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        Connect a wallet to load Aave balances and available actions.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted">
                        The dashboard reads positions for the selected network and enables transaction previews after
                        the wallet is available.
                    </p>
                    <div className="mt-6">
                        <ConnectWalletButton/>
                    </div>
                </div>
            </div>
}

const PanelSkeleton = ({title}: { title: string }) => {
    return <div className="rounded-xl border bg-surface p-4">
        <div className="mb-4 flex items-center justify-between">
            <div>
                <div className="text-sm font-semibold text-foreground">{title}</div>
                <div className="mt-2 h-2 w-28 rounded-full bg-surface-subtle"/>
            </div>
            <div className="h-7 w-16 rounded-lg bg-surface-subtle"/>
        </div>
        <div className="space-y-2">
            {[0, 1, 2].map((item) => (
                <div key={item} className="h-10 rounded-lg bg-surface-subtle"/>
            ))}
        </div>
    </div>
}

export default Assets
