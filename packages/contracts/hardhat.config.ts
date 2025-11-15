import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import 'dotenv/config'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arc: {
      url: process.env.ARC_RPC_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: parseInt(process.env.ARC_CHAIN_ID || '12345'),
    },
    hardhat: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      arc: process.env.ARC_EXPLORER_API_KEY || '',
    },
    customChains: [
      {
        network: 'arc',
        chainId: parseInt(process.env.ARC_CHAIN_ID || '12345'),
        urls: {
          apiURL: process.env.ARC_EXPLORER_API_URL || '',
          browserURL: process.env.ARC_EXPLORER_URL || '',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  typechain: {
    outDir: './typechain-types',
    target: 'ethers-v6',
  },
}

export default config

