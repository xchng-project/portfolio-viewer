'use client'

import {AaveClient, AaveProvider} from '@aave/react'
import Assets from './components/Assets'
import ChainSelector from './components/ChainSelector'

const client = AaveClient.create()

const Home = () => {
    return <AaveProvider client={client}>
        <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-6xl flex-col py-20 px-6">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 mb-2">
                        AAVE Dashboard
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Manage your deposits and borrows across multiple networks.
                    </p>
                </div>
                <ChainSelector/>
                <Assets/>
            </main>
        </div>
    </AaveProvider>
}

export default Home
