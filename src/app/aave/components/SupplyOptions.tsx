import {chainId as aaveChainId, evmAddress, useAaveMarkets} from '@aave/react'
import {Suspense} from 'react'
import SupplyOptionsTable from './SupplyOptionsTable'

interface Props {
    chainId: number
    walletAddress: string
}

const SupplyOptions = ({chainId, walletAddress}: Props) => {
    const {data: markets} = useAaveMarkets({
        chainIds: [aaveChainId(chainId)],
        user: evmAddress(walletAddress),
        suspense: true,
    })

    return <div className="w-full overflow-hidden rounded-xl border bg-surface">
        <div className="border-b px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Assets to supply</h2>
            <p className="mt-1 text-xs text-muted">Markets sorted by wallet value.</p>
        </div>
        <div className="overflow-x-auto">
            <Suspense fallback={<div className="px-4 py-8 text-sm text-muted">Loading markets...</div>}>
                <SupplyOptionsTable markets={markets || []}/>
            </Suspense>
        </div>
    </div>
}

export default SupplyOptions
