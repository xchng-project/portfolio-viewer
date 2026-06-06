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

    return <div
        className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Your Supplies</h2>
        </div>
        <div className="overflow-x-auto">
            <Suspense fallback={<div>Loading...</div>}>
                <SupplyAssetTable
                    markets={markets?.map(item => ({chainId: aaveChainId(chainId), address: item.address})) || []}
                    walletAddress={walletAddress}
                />
            </Suspense>
        </div>
    </div>
}

export default Supplies
