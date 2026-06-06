import {chainId as aaveChainId, evmAddress, useAaveMarkets} from '@aave/react'
import {Suspense} from 'react'
import SupplyAssetTable from './SupplyAssetTable'

interface Props {
    chainId: number
    walletAddress: string
}

const Supplies = ({chainId, walletAddress}: Props) => {
    const {data: markets} = useAaveMarkets({
        chainIds: [aaveChainId(chainId)],
        user: evmAddress(walletAddress),
        suspense: true,
    })

    return <div className="w-full overflow-hidden rounded-xl border bg-surface">
        <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Your supplies</h2>
            <p className="mt-1 text-xs text-muted">Active supplied assets in this market.</p>
        </div>
        <div className="overflow-x-auto">
            <Suspense fallback={<div className="px-4 py-8 text-sm text-muted">Loading supplies...</div>}>
                <SupplyAssetTable
                    markets={markets?.map(item => ({chainId: aaveChainId(chainId), address: item.address})) || []}
                    walletAddress={walletAddress}
                />
            </Suspense>
        </div>
    </div>
}

export default Supplies
