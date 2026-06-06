import {ChainId, EvmAddress, evmAddress, useUserBorrows} from '@aave/react'
import {useState} from 'react'
import {formatBalance} from '@/src/utils/functions'
import {Asset} from './Assets'
import RepayModal from './RepayModal'

interface Props {
    walletAddress: string
    markets: {chainId: ChainId, address: EvmAddress}[]
}

const columns: {
    key: keyof Omit<Asset, 'market'>
    label: string
}[] = [
    {key: 'name', label: 'Name'},
    {key: 'balance', label: 'Balance'},
    {key: 'apy', label: 'Borrow APY'},
]

const BorrowAssetTable = ({markets, walletAddress}: Props) => {
    const [isRepayModalOpen, setIsRepayModalOpen] = useState<boolean>(false)
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
        market: {
            address: item.market.address,
            chainId: Number(item.market.chain.chainId)
        }
    })) || []
    const repay = (index: number) => {
        const asset = assets[index]
        if (!asset) {
            return
        }

        setSelectedAsset(asset)
        setIsRepayModalOpen(true)
    }

    return <>
        <table className="w-full text-left">
            <thead>
            <tr className="bg-surface-subtle">
                {columns.map((col) => (
                    <th
                        key={col.key as string}
                        className="px-4 py-2.5 text-xs font-semibold text-muted"
                    >{col.label}</th>
                ))}
                <th
                    key={'action'}
                    className="px-4 py-2.5 text-xs font-semibold text-muted"
                >Action</th>
            </tr>
            </thead>
            <tbody className="divide-y">
            {assets.length > 0 ?
                assets.map((asset, index) => (
                    <tr key={index} className="hover:bg-surface-subtle">
                        {columns.map((col) => (
                            <td key={col.key as string} className="whitespace-nowrap px-4 py-3">
                                {col.key === 'symbol' ?
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-semibold text-foreground">
                                            {asset.symbol}
                                        </div>
                                    </div>
                                    :
                                    <div className={col.key === 'name' ? 'text-sm font-semibold text-foreground' : 'font-mono text-xs text-muted-strong'}>
                                        {col.key === 'balance' ? formatBalance(asset.balance) : asset[col.key] || null}
                                    </div>
                                }
                            </td>
                        ))}
                        <td key={'action'} className="whitespace-nowrap px-4 py-3">
                            <div className="text-xs text-muted-strong">
                                <button
                                    onClick={() => repay(index)}
                                    className="ui-button ui-button-compact"
                                >Repay</button>
                            </div>
                        </td>
                    </tr>
                ))
                :
                <tr>
                    <td
                        colSpan={columns.length + 1}
                        className="px-4 py-8 text-center text-sm text-muted"
                    >No borrow positions on this network.</td>
                </tr>
            }
            </tbody>
        </table>
        <RepayModal
            isOpen={isRepayModalOpen}
            onClose={() => setIsRepayModalOpen(false)}
            asset={selectedAsset}
        />
    </>
}

export default BorrowAssetTable
