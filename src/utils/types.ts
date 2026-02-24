import {AUTH_TYPES, CHAINS} from '@/src/utils/constants'

export type AuthType = typeof AUTH_TYPES[number]

export type ChainId = keyof typeof CHAINS
