'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {Suspense} from 'react'
import Borrows from './Borrows'

export interface Asset {
    apy?: string
    balance: string
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
                    {/*
                    <AssetTable
                        title="Your Supplies"
                        assets={supplies}
                        columns={[
                            {key: 'symbol', label: 'Asset'},
                            {key: 'apy', label: 'APY'},
                            {key: 'balance', label: 'Balance'}
                        ]}
                    />
*/}
                    <Suspense fallback={<div>Loading …</div>}>
                        <Borrows chainId={chainId} walletAddress={walletAddress}/>
                    </Suspense>
                </div>
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
