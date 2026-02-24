'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {ConnectWalletButton} from '@/src/app/components/wallet'
import {compactString} from '@/src/utils/functions'

const UserMenuBlock = () => {
    const {walletAddress} = useWeb3Auth()

    return <>
        {walletAddress ? compactString(walletAddress) : <ConnectWalletButton/>}
    </>
}

export default UserMenuBlock
