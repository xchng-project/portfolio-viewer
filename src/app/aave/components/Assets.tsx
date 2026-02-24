'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import AssetTable, {type Asset} from './AssetTable'

const mockSupplies: Asset[] = [
    {symbol: 'WETH', name: 'Wrapped Ether', balance: '1.25', valueInUsd: '$3,450.00', apy: '2.5%'},
    {symbol: 'USDC', name: 'USD Coin', balance: '5,000.00', valueInUsd: '$5,000.00', apy: '4.2%'},
]

const mockBorrows: Asset[] = [
    {symbol: 'DAI', name: 'Dai Stablecoin', balance: '1,000.00', valueInUsd: '$1,000.00', apy: '5.1%'},
]

const mockWalletAssets: Asset[] = [
    {symbol: 'WBTC', name: 'Wrapped BTC', balance: '0.1', valueInUsd: '$6,500.00'},
    {symbol: 'LINK', name: 'Chainlink', balance: '50.0', valueInUsd: '$900.00'},
    {symbol: 'AAVE', name: 'Aave', balance: '10.0', valueInUsd: '$1,200.00'},
]

const Assets = () => {
    const {chainId} = useWeb3Auth()

    return <>
        {chainId ?
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AssetTable
                        title="Your Supplies"
                        assets={mockSupplies}
                        columns={[
                            {key: 'symbol', label: 'Asset'},
                            {key: 'apy', label: 'APY'},
                            {key: 'valueInUsd', label: 'Value'}
                        ]}
                    />
                    <AssetTable
                        title="Your Borrows"
                        assets={mockBorrows}
                        columns={[
                            {key: 'symbol', label: 'Asset'},
                            {key: 'apy', label: 'APY'},
                            {key: 'valueInUsd', label: 'Value'}
                        ]}
                    />
                </div>
                <AssetTable
                    title="Assets in Wallet"
                    assets={mockWalletAssets}
                    columns={[
                        {key: 'symbol', label: 'Asset'},
                        {key: 'balance', label: 'Balance'},
                        {key: 'valueInUsd', label: 'Value'}
                    ]}
                />
            </div>
            :
            null
        }
    </>
}

export default Assets
