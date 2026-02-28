import {ChainId, EvmAddress, evmAddress, useUserBorrows} from '@aave/react'
import {useState} from 'react'
import {Asset} from './Assets'
import RepayModal from './RepayModal'

interface Props {
    walletAddress: string
    markets: { chainId: ChainId, address: EvmAddress }[]
}

const columns: {
    key: keyof Asset
    label: string
}[] = [
    {key: 'name', label: 'Name'},
    {key: 'balance', label: 'Balance'},
]

const BorrowAssetTable = ({markets, walletAddress}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

    const {data: borrows} = useUserBorrows({
        markets,
        suspense: true,
        user: evmAddress(walletAddress),
    })
    const assets: Asset[] = borrows?.map(item => ({
        symbol: item.currency.symbol,
        name: item.currency.name,
        balance: item.debt.amount.value,
        valueInUsd: item.debt.usd,
        apy: item.apy.formatted,
        address: item.currency.address,
    })) || []
    const repay = (index: number) => {
        const asset = assets[index]
        if (!asset) {
            return
        }

        setSelectedAsset(asset)
        setIsModalOpen(true)
    }

    return <>
        <table className="w-full text-left">
            <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                {columns.map((col) => (
                    <th
                        key={col.key as string}
                        className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >{col.label}</th>
                ))}
                <th
                    key={'action'}
                    className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                >Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {assets.length > 0 ?
                assets.map((asset, index) => (
                    <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                        {columns.map((col) => (
                            <td key={col.key as string} className="px-4 py-3 whitespace-nowrap">
                                {col.key === 'symbol' ? (
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div
                                                className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{asset.symbol}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-zinc-900 dark:text-zinc-100">
                                        {asset[col.key] || null}
                                    </div>
                                )}
                            </td>
                        ))}
                        <td key={'action'} className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-zinc-900 dark:text-zinc-100">
                                <button
                                    onClick={() => repay(index)}
                                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                                >Repay</button>
                            </div>
                        </td>
                    </tr>
                ))
                :
                <tr>
                    <td
                        colSpan={columns.length}
                        className="px-4 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                    >No assets found</td>
                </tr>
            }
            </tbody>
        </table>
        <RepayModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            asset={selectedAsset}
        />
    </>
}

export default BorrowAssetTable
