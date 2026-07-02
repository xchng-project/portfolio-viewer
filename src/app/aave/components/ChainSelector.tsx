'use client'

import {ChainsFilter, useAaveChains} from '@aave/react'
import {useWeb3Auth} from '@xchng/web3-auth'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {CHAINS} from '@/src/utils/constants'
import {ensureAaveChain} from '@/src/utils/aaveTransactions'
import {ChainId} from '@/src/utils/types'

const ChainSelector = () => {
    const {chainId, setChain, wallet} = useWeb3Auth()
    const [chainError, setChainError] = useState<string | null>(null)
    const [switchingChain, setSwitchingChain] = useState<ChainId | null>(null)
    const defaultChain = useMemo(() => Number(Object.keys(CHAINS)[0]) as ChainId, [])
    const selectedChain = chainId && Object.hasOwn(CHAINS, chainId)
        ? CHAINS[chainId as ChainId]
        : null
    const {data: chains} = useAaveChains({
        filter: ChainsFilter.MAINNET_ONLY,
        suspense: true,
    })

    useEffect(() => {
        if (!chainId) {
            setChain(defaultChain)
        }
    }, [chainId, defaultChain, setChain])

    const setNetwork = useCallback(async (chain: ChainId) => {
        const nextChain = CHAINS[chain] ? chain : defaultChain

        setChainError(null)
        setSwitchingChain(nextChain)

        try {
            if (wallet) {
                await ensureAaveChain(wallet, nextChain)
            }

            setChain(nextChain)
        } catch (e) {
            console.error('Network switch error:', e)
            setChainError(e instanceof Error ? e.message : 'Unknown error occurred')
        } finally {
            setSwitchingChain(null)
        }
    }, [defaultChain, setChain, wallet])

    return <div className="mb-6 rounded-xl border bg-surface p-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
                <h2 className="text-sm font-semibold text-foreground">Network</h2>
                <p className="mt-1 text-xs text-muted">Only supported Aave mainnets are shown.</p>
            </div>
            <span className="hidden rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium text-muted-strong sm:inline">
                {selectedChain ? selectedChain.label : 'Selecting'}
            </span>
        </div>
        <div className="flex flex-wrap gap-2">
            {chains ?
                chains.map(item => {
                    const chain: ChainId = Number(item.chainId) as ChainId
                    if (!CHAINS[chain]) {
                        return null
                    }

                    return <button
                        key={chain}
                        onClick={() => setNetwork(chain)}
                        disabled={switchingChain !== null}
                        className={`ui-button ui-button-standard ${
                            chainId === chain ?
                                'ui-button-selected'
                                :
                                ''
                        }`}
                    >{switchingChain === chain ? 'Switching...' : CHAINS[chain].label}</button>
                })
                :
                <span className="rounded-lg bg-surface-subtle px-3.5 py-2 text-sm text-muted">Loading networks...</span>
            }
        </div>
        {chainError && (
            <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
                Error: {chainError}
            </p>
        )}
    </div>
}

export default ChainSelector
