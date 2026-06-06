'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {Suspense} from 'react'
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

    return <>
        {chainId && walletAddress ?
            <div className={'flex flex-col gap-6'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Supplies chainId={chainId} walletAddress={walletAddress}/>
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Borrows chainId={chainId} walletAddress={walletAddress}/>
                    </Suspense>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <SupplyOptions chainId={chainId} walletAddress={walletAddress}/>
                </Suspense>
                {/*
                <AssetTable
                    title="Assets in Wallet"
                    assets={walletAssets}
                    columns={[
                        {key: 'symbol', label: 'Asset'},
                        {key: 'balance', label: 'Balance'}
                    ]}
                />
*/}
            </div>
            :
            null
        }
    </>
}

export default Assets
