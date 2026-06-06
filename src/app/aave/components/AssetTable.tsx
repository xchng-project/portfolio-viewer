export interface Asset {
    symbol: string
    name: string
    balance: string
    valueInUsd: string
    apy?: string
}

interface Props {
    title: string
    assets: Asset[]
    columns: {
        key: keyof Asset
        label: string
    }[]
}

const AssetTable = ({title, assets, columns}: Props) => {
    return <div className="w-full overflow-hidden rounded-xl border bg-surface">
        <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-surface-subtle">
                    {columns.map((col) => (
                        <th key={col.key as string}
                            className="px-4 py-2.5 text-xs font-semibold text-muted">
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y">
                {assets.length > 0 ?
                    assets.map((asset, index) => (
                        <tr key={index} className="hover:bg-surface-subtle">
                            {columns.map((col) => (
                                <td key={col.key as string} className="whitespace-nowrap px-4 py-3">
                                    {col.key === 'symbol' ? (
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div
                                                    className="text-sm font-semibold text-foreground">{asset.symbol}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="font-mono text-xs text-muted-strong">
                                            {asset[col.key]}
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))
                    :
                    <tr>
                        <td colSpan={columns.length}
                            className="px-4 py-8 text-center text-sm text-muted">
                            No assets found
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </div>
    </div>
}

export default AssetTable
