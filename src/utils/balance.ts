import {getAppStore} from '@xchng/web3-auth'
import {Contract, formatUnits, ZeroAddress} from 'ethers'
import {TokenBalance} from './types'

export const fetchBalance = async (
    walletAddress: string,
    tokenAddress?: string
): Promise<TokenBalance> => {
    const {provider} = getAppStore()
    if (!provider) {
        throw Error(`provider does not exist`)
    }

    let balance: bigint
    let decimals = 18
    if (!tokenAddress || tokenAddress === ZeroAddress) {
        balance = await provider.getBalance(walletAddress)
    } else {
        const abi = [
            'function balanceOf(address account) view returns (uint256)',
            'function decimals() view returns (uint8)'
        ]
        const contract = new Contract(tokenAddress, abi, provider)
        const [bal, dec] = await Promise.all([
            contract.balanceOf(walletAddress),
            contract.decimals()
        ])
        balance = bal
        decimals = Number(dec)
    }
    
    return {
        balance,
        decimals,
        formatted: formatUnits(balance, decimals)
    }
}
