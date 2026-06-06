import {Market} from '@aave/react'
import {useState} from 'react'
import {formatBalance} from '@/src/utils/functions'
import {Asset} from './Assets'
import BorrowModal from './BorrowModal'
import SupplyModal from './SupplyModal'

interface Props {
    markets: Market[]
}

export interface SupplyOption {
    address: string
    apy: string
    balance: string
    borrowApy: string
    borrowable: boolean
    market: {
        address: string
        chainId: number
    }
    name: string
    supplyCap: string
    symbol: string
    totalSupplied: string
    valueInUsd: string
}

const columns: {
    key: keyof Pick<SupplyOption, 'name' | 'balance' | 'valueInUsd' | 'apy' | 'borrowApy' | 'totalSupplied' | 'supplyCap'>
    label: string
}[] = [
    {key: 'name', label: 'Asset'},
    {key: 'balance', label: 'Wallet'},
    {key: 'valueInUsd', label: 'Value'},
    {key: 'apy', label: 'Supply APY'},
    {key: 'borrowApy', label: 'Borrow APY'},
    {key: 'totalSupplied', label: 'Total supplied'},
    {key: 'supplyCap', label: 'Supply cap'},
]

const SupplyOptionsTable = ({markets}: Props) => {
    const [isSupplyModalOpen, setIsSupplyModalOpen] = useState<boolean>(false)
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<SupplyOption | null>(null)
    const assets: SupplyOption[] = markets
        .flatMap((market) => market.supplyReserves)
        .filter((reserve) => !reserve.isPaused && !reserve.isFrozen && !reserve.supplyInfo.supplyCapReached)
        .map((reserve) => ({
            address: reserve.underlyingToken.address,
            apy: reserve.supplyInfo.apy.formatted,
            balance: reserve.userState?.suppliable.amount.value ?? '0',
            borrowApy: reserve.borrowInfo?.apy.formatted ?? '-',
            borrowable: reserve.borrowInfo?.borrowingState === 'ENABLED' && !reserve.borrowInfo.borrowCapReached && reserve.userState?.canBeBorrowed === true,
            market: {
                address: reserve.market.address,
                chainId: Number(reserve.market.chain.chainId)
            },
            name: reserve.underlyingToken.name,
            supplyCap: reserve.supplyInfo.supplyCap.amount.value,
            symbol: reserve.underlyingToken.symbol,
            totalSupplied: reserve.supplyInfo.total.value,
            valueInUsd: reserve.userState?.suppliable.usd ?? '0',
        }))
        .sort((a, b) => Number(b.valueInUsd) - Number(a.valueInUsd))

    const supply = (index: number) => {
        const asset = assets[index]
        if (!asset) {
            return
        }

        setSelectedAsset(asset)
        setIsSupplyModalOpen(true)
    }

    const borrow = (index: number) => {
        const asset = assets[index]
        if (!asset || !asset.borrowable) {
            return
        }

        setSelectedAsset(asset)
        setIsBorrowModalOpen(true)
    }

    const selectedBorrowAsset: Asset | null = selectedAsset ? {
        address: selectedAsset.address,
        apy: selectedAsset.borrowApy,
        balance: '0',
        market: selectedAsset.market,
        name: selectedAsset.name,
        symbol: selectedAsset.symbol,
        valueInUsd: '0',
    } : null

    return <>
        <table className="w-full text-left">
        <thead>
        <tr className="bg-surface-subtle">
            {columns.map((col) => (
                <th
                    key={col.key}
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
                <tr key={`${asset.market.address}:${asset.address}`} className="hover:bg-surface-subtle">
                    {columns.map((col) => (
                        <td key={col.key} className="whitespace-nowrap px-4 py-3">
                            {col.key === 'name' ?
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">{asset.symbol}</span>
                                    <span className="text-xs text-muted">{asset.name}</span>
                                </div>
                                :
                                <div className="font-mono text-xs text-muted-strong">
                                    {col.key === 'balance' || col.key === 'valueInUsd' || col.key === 'totalSupplied' || col.key === 'supplyCap' ?
                                        formatBalance(asset[col.key])
                                        :
                                        asset[col.key]
                                    }
                                </div>
                            }
                        </td>
                    ))}
                    <td key={'action'} className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2 text-xs text-muted-strong">
                            <button
                                onClick={() => supply(index)}
                                className="ui-button ui-button-primary ui-button-compact"
                            >Supply</button>
                            <button
                                onClick={() => borrow(index)}
                                disabled={!asset.borrowable}
                                className="ui-button ui-button-compact"
                            >Borrow</button>
                        </div>
                    </td>
                </tr>
            ))
            :
            <tr>
                <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-muted"
                >No supply-ready assets found for this wallet.</td>
            </tr>
        }
        </tbody>
    </table>
        <SupplyModal
            isOpen={isSupplyModalOpen}
            onClose={() => setIsSupplyModalOpen(false)}
            asset={selectedAsset}
        />
        <BorrowModal
            isOpen={isBorrowModalOpen}
            onClose={() => setIsBorrowModalOpen(false)}
            asset={selectedBorrowAsset}
        />
    </>
}

export default SupplyOptionsTable
