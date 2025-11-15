# PredictFlow

**Institutional Prediction Markets with AI Agent Market Making on Arc**

> Solving prediction market liquidity through autonomous AI agents on Circle's Arc blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## 🎯 Overview

PredictFlow mirrors markets from Polymarket to Arc blockchain and uses AI agents to provide deep, continuous liquidity. Built for the Arc DeFi Hackathon, integrating all 4 tracks:

1. **Smart Contracts** - Advanced stablecoin logic with USDC/EURC
2. **Cross-Chain** - Bridge Kit for multi-chain participation  
3. **Treasury** - Gateway for automated fund management
4. **Embedded Wallets** - Circle Wallets for Web2-friendly UX

## ✨ Key Features

- 🔄 **Market Mirroring** - Mirror top Polymarket markets to Arc
- 🤖 **AI Market Making** - Autonomous agents provide 24/7 liquidity
- ⚡ **Sub-Second Finality** - Instant execution on Arc
- 💰 **USDC Gas Fees** - Pay fees in stablecoins, not volatile tokens
- 🌉 **Cross-Chain Bridge** - Seamless USDC bridging via CCTP
- 👛 **Hybrid Wallets** - Circle Wallets (Web2) + Wagmi (Web3)

## 🏗️ Architecture

```
┌─────────────┐
│  Polymarket │ (Source)
└──────┬──────┘
       │ API/Subgraph
       ▼
┌─────────────────┐
│ Market Mirroring│
│    Service      │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────┐
│   PredictFlow (Arc)      │
│  ┌────────────────────┐  │
│  │ Smart Contracts    │  │
│  │ - MarketFactory    │  │
│  │ - MarketMirror     │  │
│  │ - PredictionMarket │  │
│  │ - AgentRegistry    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ AI Agents          │  │
│  │ - Provide Liquidity│  │
│  │ - Update Quotes    │  │
│  │ - Sync Prices      │  │
│  └────────────────────┘  │
└──────────────────────────┘
       │
       ▼
┌──────────────────┐
│    Users Trade   │
│ Better Execution │
└──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone repository
git clone <repo-url>
cd predictflow

# Install all dependencies
npm install

# Install contracts dependencies
cd packages/contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### Environment Setup

```bash
# Copy example env
cp packages/frontend/.env.example packages/frontend/.env.local

# Edit with your API keys
# - Circle API Key
# - Circle App ID
# - Arc RPC URL
# - Contract addresses
```

### Development

```bash
# Terminal 1: Compile contracts
cd packages/contracts
npx hardhat compile

# Terminal 2: Run tests
npx hardhat test

# Terminal 3: Start frontend
cd packages/frontend
npm run dev
```

Access at: http://localhost:3000

## 📦 Project Structure

```
predictflow/
├── packages/
│   ├── contracts/          # Smart contracts (Hardhat)
│   │   ├── contracts/
│   │   │   ├── core/      # MarketFactory, MarketMirror, PredictionMarket
│   │   │   ├── agents/    # AgentRegistry
│   │   │   └── settlement/# SettlementContract
│   │   ├── scripts/       # Deployment scripts
│   │   └── test/          # Contract tests
│   │
│   ├── frontend/          # Next.js 14 app
│   │   ├── src/
│   │   │   ├── app/      # Pages (App Router)
│   │   │   ├── components/ # UI components (Shadcn)
│   │   │   └── lib/      # Services (Polymarket, Circle, Wagmi)
│   │   └── package.json
│   │
│   └── shared/            # Shared types and utilities
│       └── src/types/
│
├── docs/                  # Documentation
│   ├── implementation-hackathon.md
│   ├── claude-context.md
│   └── best-practices-tech-stack.md
│
├── ARCHITECTURE.md
├── PROJECT_STRUCTURE.md
├── IMPLEMENTATION_STATUS.md
└── SETUP_INSTRUCTIONS.md
```

## 🔧 Tech Stack

### Smart Contracts
- **Solidity 0.8.20** - Secure contract development
- **Hardhat** - Development environment
- **OpenZeppelin** - Battle-tested libraries
- **TypeChain** - TypeScript contract types

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Wagmi** - Web3 hooks
- **Circle SDK** - Embedded wallets
- **Apollo Client** - GraphQL (Polymarket)
- **React Query** - Data fetching

### Blockchain
- **Arc** - Layer-1 blockchain by Circle
- **USDC/EURC** - Native stablecoins
- **Circle APIs** - Gateway, Wallets, Bridge Kit, CCTP

## 🧪 Testing

```bash
# Run all contract tests
cd packages/contracts
npx hardhat test

# Run specific test file
npx hardhat test test/PredictionMarket.test.ts

# Generate coverage report
npx hardhat coverage
```

## 📝 Smart Contracts

### Core Contracts

**MarketFactory** - Create prediction markets
```solidity
function createMarket(
    string memory question,
    uint256 endDate,
    address oracle,
    address currency
) external returns (uint256)
```

**PredictionMarket** - AMM for binary outcomes
```solidity
function buyShares(bool outcome, uint256 amount) external returns (uint256)
function sellShares(bool outcome, uint256 shares) external returns (uint256)
function settle(bool outcome) external
```

**MarketMirror** - Mirror Polymarket markets
```solidity
function mirrorMarket(
    string memory polymarketId,
    string memory question,
    uint256 endDate,
    address oracle,
    address treasuryWallet
) external returns (uint256)
```

**AgentRegistry** - Manage AI agents
```solidity
function registerAgent(string memory name) external returns (uint256)
function updateReputation(uint256 agentId, int256 change) external
```

## 🎨 Frontend Pages

- **`/`** - Landing page with features
- **`/dashboard`** - Overview with stats
- **`/dashboard/markets`** - Browse markets (Polymarket mirrored)
- **`/dashboard/trading`** - Trading interface
- **`/dashboard/agents`** - AI agent dashboard
- **`/dashboard/wallet`** - Wallet management

## 🔐 Security

- ✅ **ReentrancyGuard** on all state-changing functions
- ✅ **Access Control** for admin/oracle functions
- ✅ **Input Validation** on all parameters
- ✅ **Safe Math** via Solidity 0.8+
- ✅ **Comprehensive Tests** with edge cases

## 📚 Documentation

- **[Implementation Guide](docs/implementation-hackathon.md)** - Step-by-step implementation
- **[Architecture](ARCHITECTURE.md)** - System design and patterns
- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Implementation Status](IMPLEMENTATION_STATUS.md)** - Current progress
- **[Project Structure](PROJECT_STRUCTURE.md)** - Code organization

## 🛣️ Roadmap

### Phase 1: MVP (Hackathon) ✅ 75%
- ✅ Core smart contracts
- ✅ Frontend UI/UX
- ✅ Polymarket integration
- ✅ Circle Wallets integration
- ⬜ Deploy to Arc testnet
- ⬜ Market mirroring service
- ⬜ Trading interface

### Phase 2: Enhanced Features
- ⬜ Advanced AI agent strategies
- ⬜ Multi-currency support (EUR, GBP)
- ⬜ Agent-to-agent communication
- ⬜ Advanced analytics dashboard

### Phase 3: Production
- ⬜ Audit smart contracts
- ⬜ Mainnet deployment
- ⬜ Mobile app
- ⬜ API for third-party integration

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Circle** for Arc blockchain and developer tools
- **Encode Club** for organizing the hackathon
- **Polymarket** for market data and inspiration
- **OpenZeppelin** for secure contract libraries

## 📞 Contact

- **GitHub**: [Your GitHub]
- **Twitter**: [Your Twitter]
- **Discord**: [Your Discord]

---

**Built with ❤️ for the Arc DeFi Hackathon**

*PredictFlow - Where AI meets prediction markets*
