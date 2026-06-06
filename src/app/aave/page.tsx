'use client'

import {AaveClient, AaveProvider} from '@aave/react'
import Assets from './components/Assets'
import ChainSelector from './components/ChainSelector'

const client = AaveClient.create()

const Home = () => {
    return <AaveProvider client={client}>
        <div className="min-h-[calc(100vh-57px)] bg-background">
            <main className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
                <ChainSelector/>
                <Assets/>
            </main>
        </div>
    </AaveProvider>
}

export default Home
