import {ChainId} from '@/src/utils/types'

type StorageKeys = 'authType' | 'walletAddress'
type StorageNetworkKeys = ''
type StorageWalletKeys = ''

const prefix = 'XCHNG_portfolio'
const hasWindows = typeof window !== 'undefined'

const safeGet = (key: string): string | null => {
    if (!hasWindows) {
        return null
    }

    const value = localStorage.getItem(key)
    return value === '' ? null : value
}

const safeSet = (key: string, value: string | number | null): void => {
    if (!hasWindows) {
        return
    }

    localStorage.setItem(key, value?.toString() || '')
}

export const getFromStorage = (key: StorageKeys): string | null => {
    return safeGet(`${prefix}:${key}`)
}

export const getFromNetworkStorage = (key: StorageNetworkKeys, chainId: ChainId | null): string | null => {
    if (!chainId) {
        return null
    }

    const wallet = getFromStorage('walletAddress')
    if (!wallet) {
        return null
    }

    return safeGet(`${prefix}:${wallet}:${chainId}:${key}`)
}

export const getFromWalletStorage = (key: StorageWalletKeys): string | null => {
    const wallet = getFromStorage('walletAddress')
    if (!wallet) {
        return null
    }

    return safeGet(`${prefix}:${wallet}:${key}`)
}

export const setToStorage = (key: StorageKeys, value: string | number | null): void => {
    safeSet(`${prefix}:${key}`, value)
}

export const setToNetworkStorage = (key: StorageNetworkKeys, value: string | number | null, chainId: ChainId | null): void => {
    if (!chainId) {
        return
    }

    const wallet = getFromStorage('walletAddress')
    if (!wallet) {
        return
    }

    safeSet(`${prefix}:${wallet}:${chainId}:${key}`, value)
}

export const setToWalletStorage = (key: StorageWalletKeys, value: string | number | null, walletAddress?: string): void => {
    let wallet = getFromStorage('walletAddress')
    if (!wallet) {
        if (!walletAddress) {
            return
        }
        wallet = walletAddress
    }

    safeSet(`${prefix}:${wallet}:${key}`, value)
}
