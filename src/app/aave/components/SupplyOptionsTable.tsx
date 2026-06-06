import {Market} from '@aave/react'
import {useState} from 'react'
import {formatBalance} from '@/src/utils/functions'
import SupplyModal from './SupplyModal'

interface Props {
    markets: Market[]
}

export interface SupplyOption {
    address: string
    apy: string
    balance: string
    market: {
        address: string
        chainId: number
    }
    name: string
    supplyCap: string
    symbol: string
    totalSupplied: string
}

const columns: {
    key: keyof Pick<SupplyOption, 'name' | 'balance' | 'apy' | 'totalSupplied' | 'supplyCap'>
    label: string
}[] = [
    {key: 'name', label: 'Asset'},
    {key: 'balance', label: 'Wallet'},
    {key: 'apy', label: 'Supply APY'},
    {key: 'totalSupplied', label: 'Total supplied'},
    {key: 'supplyCap', label: 'Supply cap'},
]

const SupplyOptionsTable = ({markets}: Props) => {
    const [isSupplyModalOpen, setIsSupplyModalOpen] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<SupplyOption | null>(null)
    const assets: SupplyOption[] = markets
        .flatMap((market) => market.supplyReserves)
        .filter((reserve) => !reserve.isPaused && !reserve.isFrozen && !reserve.supplyInfo.supplyCapReached)
        .map((reserve) => ({
            address: reserve.underlyingToken.address,
            apy: reserve.supplyInfo.apy.formatted,
            balance: reserve.userState?.suppliable.amount.value ?? '0',
            market: {
                address: reserve.market.address,
                chainId: Number(reserve.market.chain.chainId)
            },
            name: reserve.underlyingToken.name,
            supplyCap: reserve.supplyInfo.supplyCap.amount.value,
            symbol: reserve.underlyingToken.symbol,
            totalSupplied: reserve.supplyInfo.total.value,
        }))

    const supply = (index: number) => {
        const asset = assets[index]
        if (!asset) {
            return
        }

        setSelectedAsset(asset)
        setIsSupplyModalOpen(true)
    }

    return <>
        <table className="w-full text-left">
        <thead>
        <tr className="bg-zinc-50 dark:bg-zinc-900/50">
            {columns.map((col) => (
                <th
                    key={col.key}
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
                <tr key={`${asset.market.address}:${asset.address}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                            {col.key === 'name' ?
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{asset.symbol}</span>
                                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{asset.name}</span>
                                </div>
                                :
                                <div className="text-xs text-zinc-900 dark:text-zinc-100">
                                    {col.key === 'balance' || col.key === 'totalSupplied' || col.key === 'supplyCap' ?
                                        formatBalance(asset[col.key])
                                        :
                                        asset[col.key]
                                    }
                                </div>
                            }
                        </td>
                    ))}
                    <td key={'action'} className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-zinc-900 dark:text-zinc-100">
                            <button
                                onClick={() => supply(index)}
                                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                            >Supply</button>
                        </div>
                    </td>
                </tr>
            ))
            :
            <tr>
                <td
                    colSpan={columns.length + 1}
                    className="px-4 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                >No assets found</td>
            </tr>
        }
        </tbody>
    </table>
        <SupplyModal
            isOpen={isSupplyModalOpen}
            onClose={() => setIsSupplyModalOpen(false)}
            asset={selectedAsset}
        />
    </>
}

export default SupplyOptionsTable
