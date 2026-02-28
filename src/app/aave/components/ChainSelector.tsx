'use client'

import {ChainsFilter, useAaveChains} from '@aave/react'
import {useWeb3Auth} from '@xchng/web3-auth'
import {useCallback, useEffect} from 'react'
import {CHAINS} from '@/src/utils/constants'
import {ChainId} from '@/src/utils/types'

const ChainSelector = () => {
    const {chainId, setChain} = useWeb3Auth()
    const {data: chains} = useAaveChains({
        filter: ChainsFilter.MAINNET_ONLY,
        suspense: true,
    })

    useEffect(() => {
        if (!chainId) {
            setChain(Number(Object.keys(CHAINS)[0]) as ChainId)
        }
    }, [])

    const setNetwork = useCallback((chain: ChainId) => {
        if (CHAINS[chain]) {
            setChain(chain)
        } else {
            setChain(Number(Object.keys(CHAINS)[0]) as ChainId)
        }
    }, [])

    return <div className="flex flex-wrap gap-2 mb-8">
        {chains ?
            chains.map(item => {
                const chain: ChainId = Number(item.chainId) as ChainId
                if (!CHAINS[chain]) {
                    return null
                }

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
            })
            :
            'Loading...'
        }
    </div>
}

export default ChainSelector
