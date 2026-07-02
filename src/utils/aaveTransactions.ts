import type {Eip1193Provider} from 'ethers'
import {CHAINS} from '@/src/utils/constants'
import type {ChainId} from '@/src/utils/types'

interface Eip1193ProviderWithRequest extends Eip1193Provider {
    request: (args: {method: string; params?: unknown[]}) => Promise<unknown>
}

interface AaveTransactionWallet {
    chainId: string
    getEthereumProvider: () => Promise<Eip1193ProviderWithRequest>
    switchChain: (chainId: number) => Promise<void>
}

const getWalletChainId = (wallet: AaveTransactionWallet) => {
    const chainId = wallet.chainId.split(':').pop()
    return chainId ? Number(chainId) : null
}

const isUnsupportedChainError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return false
    }

    return error.message.includes('Unsupported chainId')
}

const toHexChainId = (chainId: number) => `0x${chainId.toString(16)}`

const addEthereumChain = async (
    wallet: AaveTransactionWallet,
    chainId: ChainId
) => {
    const chain = CHAINS[chainId]
    const ethereumProvider = await wallet.getEthereumProvider()

    await ethereumProvider.request({
        method: 'wallet_addEthereumChain',
        params: [{
            blockExplorerUrls: [chain.blockExplorer],
            chainId: toHexChainId(Number(chainId)),
            chainName: chain.label,
            nativeCurrency: {
                decimals: chain.tokenPrecision,
                name: chain.token,
                symbol: chain.token,
            },
            rpcUrls: [chain.rpcUrl],
        }],
    })
}

export const ensureAaveChain = async (
    wallet: AaveTransactionWallet,
    chainId: number
) => {
    const supportedChainId = chainId as ChainId

    if (!Object.hasOwn(CHAINS, supportedChainId)) {
        throw new Error(`Unsupported chainId: ${chainId}`)
    }

    if (getWalletChainId(wallet) === chainId) {
        return
    }

    try {
        await wallet.switchChain(chainId)
    } catch (error) {
        if (!isUnsupportedChainError(error)) {
            throw error
        }

        await addEthereumChain(wallet, supportedChainId)
        const ethereumProvider = await wallet.getEthereumProvider()

        await ethereumProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: toHexChainId(chainId)}],
        })
    }
}
