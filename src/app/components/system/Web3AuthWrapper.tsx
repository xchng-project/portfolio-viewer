'use client'

import {initWeb3Auth, Web3AuthProvider} from '@xchng/web3-auth'
import type {ReactNode} from 'react'
import {PRIVY_APP_ID, PRIVY_CLIENT_ID} from '@/src/utils/constants'

initWeb3Auth({
    privyAppId: PRIVY_APP_ID,
    privyClientId: PRIVY_CLIENT_ID,
})

const Web3AuthWrapper = ({children}: {children: ReactNode}) => {
    return <Web3AuthProvider>{children}</Web3AuthProvider>
}

export default Web3AuthWrapper
