import {ChainId, EvmAddress, evmAddress, useUserSupplies} from '@aave/react'
import {useState} from 'react'
import {compactString, formatBalance} from '@/src/utils/functions'
import {Asset} from './Assets'
import WithdrawModal from './WithdrawModal'

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
]

const SupplyAssetTable = ({markets, walletAddress}: Props) => {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<SupplyAsset | null>(null)
    const {data: supplies} = useUserSupplies({
        markets,
        suspense: true,
        user: evmAddress(walletAddress),
    })

    const assets: SupplyAsset[] = supplies?.map(item => ({
        symbol: item.currency.symbol,
        name: compactString(item.currency.name, 0, 20),
        balance: formatBalance(item.balance.amount.value),
        valueInUsd: formatBalance(item.balance.usd),
        apy: item.apy.formatted,
        address: item.currency.address,
        collateral: item.isCollateral ? 'Yes' : item.canBeCollateral ? 'Available' : 'No',
        market: {
            address: item.market.address,
            chainId: Number(item.market.chain.chainId)
        }
    })) || []

    const withdraw = (index: number) => {
        const asset = assets[index]
        if (!asset) {
            return
        }

        setSelectedAsset(asset)
        setIsWithdrawModalOpen(true)
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
                            <div className={col.key === 'name' ? 'text-sm font-semibold text-foreground' : 'font-mono text-xs text-muted-strong'}>
                                {asset[col.key] || null}
                            </div>
                        </td>
                    ))}
                    <td key={'action'} className="whitespace-nowrap px-4 py-3">
                        <div className="text-xs text-muted-strong">
                            <button
                                onClick={() => withdraw(index)}
                                className="ui-button ui-button-compact"
                            >Withdraw</button>
                        </div>
                    </td>
                </tr>
            ))
            :
            <tr>
                <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-muted"
                >No supplied assets on this network.
                </td>
            </tr>
        }
        </tbody>
    </table>
        <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            asset={selectedAsset}
        />
    </>
}

export default SupplyAssetTable
