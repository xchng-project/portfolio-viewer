'use client'

import {useWeb3Auth} from '@xchng/web3-auth'
import {ConnectWalletButton} from '@/src/app/components/wallet'
import {compactString} from '@/src/utils/functions'

const UserMenuBlock = () => {
    const {walletAddress} = useWeb3Auth()

    return walletAddress ?
        <div className="flex items-center gap-2 rounded-lg border bg-surface-subtle px-3 py-2 text-sm font-medium text-muted-strong">
            <span className="size-2 rounded-full bg-success"/>
            <span className="font-mono text-xs">{compactString(walletAddress, 4)}</span>
        </div>
        :
        <ConnectWalletButton/>
}

export default UserMenuBlock
