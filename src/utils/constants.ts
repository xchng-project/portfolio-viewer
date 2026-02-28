export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ''

export interface ChainType {
    blockExplorer: string
    blockExplorerNftLink: (contract: string, tokenId: string) => string
    blockExplorerTxHash: (hash: string) => string
    eipPrefix: string
    label: string
    name: string
    testnet: boolean
    token: string
    tokenPrecision: number
}

export const CHAINS = {
    1: {
        eipPrefix: 'ERC',
        token: 'ETH',
        tokenPrecision: 18,
        label: 'Ethereum',
        name: 'ethereum',
        testnet: false,
        blockExplorer: 'https://etherscan.io',
        blockExplorerNftLink: (contract, tokenId) => (`https://etherscan.io/nft/${contract}/${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://etherscan.io/tx/${hash}`),
    },
    56: {
        eipPrefix: 'BEP',
        token: 'BNB',
        tokenPrecision: 18,
        label: 'BNB chain',
        name: 'bnb',
        testnet: false,
        blockExplorer: 'https://bscscan.com',
        blockExplorerNftLink: (contract, tokenId) => (`https://bscscan.com/nft/${contract}/${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://bscscan.com/tx/${hash}`),
    },
    137: {
        eipPrefix: 'ERC',
        token: 'MATIC',
        tokenPrecision: 18,
        label: 'Polygon',
        name: 'polygon',
        testnet: false,
        blockExplorer: 'https://polygonscan.com',
        blockExplorerNftLink: (contract, tokenId) => (`https://polygonscan.com/nft/${contract}/${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://polygonscan.com/tx/${hash}`),
    },
    42161: {
        eipPrefix: 'ERC',
        token: 'ETH',
        tokenPrecision: 18,
        label: 'Arbitrum',
        name: 'arbitrum-one',
        testnet: false,
        blockExplorer: 'https://arbiscan.io',
        blockExplorerNftLink: (contract, tokenId) => (`https://arbiscan.io/token/${contract}?a=${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://arbiscan.io/tx/${hash}`),
    },
    81457: {
        eipPrefix: 'ERC',
        token: 'ETH',
        tokenPrecision: 18,
        label: 'Blast',
        name: 'blast',
        testnet: false,
        blockExplorer: 'https://blastscan.io',
        blockExplorerNftLink: (contract, tokenId) => (`https://blastscan.io/token/${contract}?a=${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://blastscan.io/tx/${hash}`),
    },
    11155111: {
        eipPrefix: 'ERC',
        token: 'ETH',
        tokenPrecision: 18,
        label: 'Sepolia',
        name: 'sepolia',
        testnet: true,
        blockExplorer: 'https://sepolia.etherscan.io',
        blockExplorerNftLink: (contract, tokenId) => (`https://sepolia.etherscan.io/token/${contract}?a=${tokenId}`),
        blockExplorerTxHash: (hash) => (`https://sepolia.etherscan.io/tx/${hash}`),
    },
} satisfies Record<string, ChainType>
