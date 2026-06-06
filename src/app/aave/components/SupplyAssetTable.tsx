import {ChainId, EvmAddress, evmAddress, useUserSupplies} from '@aave/react'
import {formatBalance} from '@/src/utils/functions'
import {Asset} from './Assets'

interface Props {
    walletAddress: string
    markets: { chainId: ChainId, address: EvmAddress }[]
}

interface SupplyAsset extends Asset {
    collateral: string
}

const columns: {
    key: keyof Omit<SupplyAsset, 'market'>
    label: string
}[] = [
    {key: 'name', label: 'Name'},
    {key: 'balance', label: 'Balance'},
    {key: 'valueInUsd', label: 'Value'},
    {key: 'apy', label: 'APY'},
    {key: 'collateral', label: 'Collateral'},
]

const SupplyAssetTable = ({markets, walletAddress}: Props) => {
    const {data: supplies} = useUserSupplies({
        markets,
        suspense: true,
        user: evmAddress(walletAddress),
    })

    const assets: SupplyAsset[] = supplies?.map(item => ({
        symbol: item.currency.symbol,
        name: item.currency.name,
        balance: item.balance.amount.value,
        valueInUsd: item.balance.usd,
        apy: item.apy.formatted,
        address: item.currency.address,
        collateral: item.isCollateral ? 'Yes' : item.canBeCollateral ? 'Available' : 'No',
        market: {
            address: item.market.address,
            chainId: Number(item.market.chain.chainId)
        }
    })) || []

    return <table className="w-full text-left">
        <thead>
        <tr className="bg-zinc-50 dark:bg-zinc-900/50">
            {columns.map((col) => (
                <th
                    key={col.key as string}
                    className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                >{col.label}</th>
            ))}
        </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {assets.length > 0 ?
            assets.map((asset, index) => (
                <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    {columns.map((col) => (
                        <td key={col.key as string} className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-zinc-900 dark:text-zinc-100">
                                {col.key === 'balance' || col.key === 'valueInUsd' ? formatBalance(asset.balance) : asset[col.key] || null}
                            </div>
                        </td>
                    ))}
                </tr>
            ))
            :
            <tr>
                <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                >No assets found
                </td>
            </tr>
        }
        </tbody>
    </table>
}

export default SupplyAssetTable
