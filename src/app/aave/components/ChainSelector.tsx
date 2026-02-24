'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {useCallback, useEffect} from 'react'
import {AAVE_CHAINS, CHAINS} from '@/src/utils/constants'
import {ChainId} from '@/src/utils/types'

const ChainSelector = () => {
    const {chainId, setChain} = useWeb3Auth()

    useEffect(() => {
        if (!chainId) {
            setChain(Number(Object.keys(AAVE_CHAINS)[0]) as ChainId)
        }
    }, [])

    const setNetwork = useCallback((chain: ChainId) => {
        if (AAVE_CHAINS[chain]) {
            setChain(chain)
        } else {
            setChain(Number(Object.keys(AAVE_CHAINS)[0]) as ChainId)
        }
    }, [])

    return <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(AAVE_CHAINS).map((id) => {
            const chain: ChainId = Number(id) as ChainId
            return <button
                key={chain}
                onClick={() => setNetwork(chain)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chainId === chain ? 
                        'bg-blue-600 text-white'
                        : 
                        'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
            >{CHAINS[chain].label}</button>
        })}
    </div>
}

export default ChainSelector
