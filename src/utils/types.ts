import {CHAINS} from '@/src/utils/constants'

export type ChainId = keyof typeof CHAINS

export interface TokenBalance {
    balance: bigint
    decimals: number
    formatted: string
}
