import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

// Arc chain configuration
const arcChain = {
  id: parseInt(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '12345'),
  name: 'Arc',
  network: 'arc',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arc Explorer',
      url: 'https://explorer.arc.network',
    },
  },
} as const

export const config = createConfig({
  chains: [arcChain],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [arcChain.id]: http(),
  },
  ssr: true,
})

export { arcChain }

