import {useWeb3Auth} from '@xchng/web3-auth'

const ConnectWalletButton = () => {
    const {connected, connecting, connectWallet} = useWeb3Auth()

    if (connected) {
        return null
    }

    return <button
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        disabled={connecting}
        onClick={connectWallet}
    >Connect Wallet</button>
}

export default ConnectWalletButton
