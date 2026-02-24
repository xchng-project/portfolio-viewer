import {initWeb3Auth} from '@xchng/web3-auth'
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import type {ReactNode} from 'react'
import {Header} from '@/src/app/components/layouts'
import {Web3AuthWrapper} from '@/src/app/components/system'
import {PRIVY_APP_ID, PRIVY_CLIENT_ID} from '@/src/utils/constants'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Portfolio viewer',
    description: 'View and manage your portfolio',
}

initWeb3Auth({
    privyAppId: PRIVY_APP_ID,
    privyClientId: PRIVY_CLIENT_ID,
})

const RootLayout = ({children}: Readonly<{ children: ReactNode }>) => {
    return <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <Web3AuthWrapper>
        <Header/>
        {children}
    </Web3AuthWrapper>
    </body>
    </html>
}

export default RootLayout
