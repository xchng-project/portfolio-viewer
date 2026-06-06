import {useWeb3Auth} from '@xchng/web3-auth'

const ConnectWalletButton = () => {
    const {connected, connecting, connectWallet} = useWeb3Auth()

    if (connected) {
        return null
    }

    return <button
        className="ui-button ui-button-primary ui-button-standard disabled:opacity-60"
        disabled={connecting}
        onClick={connectWallet}
    >{connecting ? 'Connecting...' : 'Connect wallet'}</button>
}

export default ConnectWalletButton
