# PredictFlow: Hackathon Implementation Guide

**Project:** PredictFlow / ForecastChain  
**Hackathon:** ARC DeFi Hackathon  
**Duration:** 3 Days  
**Network:** Arc Blockchain  
**Currencies:** USDC (primary), EURC (secondary)

---

## 🎯 Implementation Overview

This document provides a step-by-step implementation guide for building PredictFlow during the hackathon. Focus on delivering a working MVP that demonstrates all 4 tracks integrated with AI agent market making.

### MVP Goals
- ✅ Mirror markets from Polymarket to Arc
- ✅ AI agent provides liquidity autonomously on mirrored markets
- ✅ Cross-chain participation via Bridge Kit
- ✅ Treasury management via Gateway
- ✅ Embedded wallets via Circle Wallets
- ✅ Working demo in 5 minutes

---

## 📋 Pre-Hackathon Setup

### 1. Development Environment

**Required Tools:**
```bash
# Node.js (v18+)
node --version

# Package Manager
npm install -g pnpm  # or use npm/yarn

# Git
git --version

# Code Editor
# VS Code with extensions:
# - Solidity (Juan Blanco)
# - Hardhat (Nomic Foundation)
# - ESLint
# - Prettier
```

**Arc Network Setup:**
```bash
# Install Hardhat
npm install --save-dev hardhat

# Install Arc dependencies
npm install @nomicfoundation/hardhat-toolbox
npm install @nomicfoundation/hardhat-verify
npm install dotenv

# Install USDC/EURC contracts
npm install @openzeppelin/contracts

# Install Polymarket integration dependencies
npm install @apollo/client graphql
# OR use Polymarket CLOB client
npm install @polymarket/clob-client
```

**Frontend Setup:**
```bash
# Option 1: Start from Next.js Shadcn Dashboard Starter (Recommended)
# Clone the dashboard starter as base
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git predictflow-frontend
cd predictflow-frontend

# Install dependencies (uses pnpm by default)
pnpm install

# Option 2: Create fresh Next.js app and add components manually
# npx create-next-app@latest predictflow-frontend --typescript --tailwind --app
# cd predictflow-frontend

# Install PredictFlow-specific dependencies
pnpm add @tanstack/react-query @tanstack/react-table
pnpm add wagmi viem @wagmi/core
pnpm add @apollo/client graphql
pnpm add recharts
pnpm add date-fns
pnpm add nuqs  # For search params state management
pnpm add zustand  # State management (already in dashboard starter)
pnpm add react-hook-form zod  # Forms (already in dashboard starter)
pnpm add @radix-ui/react-*  # UI primitives (via shadcn)
pnpm add lucide-react  # Icons (already in dashboard starter)
```

### 2. Circle API Setup

**Get API Keys:**
1. Sign up for Circle Developer account
2. Get API keys for:
   - Circle Gateway API
   - Circle Wallets API
   - Circle Bridge Kit API
   - CCTP API

**Environment Variables:**
```env
# .env.local
NEXT_PUBLIC_ARC_RPC_URL=https://arc-rpc-url
NEXT_PUBLIC_ARC_CHAIN_ID=12345

# Circle API Keys
CIRCLE_API_KEY=your_api_key
CIRCLE_WALLET_API_KEY=your_wallet_key
CIRCLE_GATEWAY_API_KEY=your_gateway_key

# USDC/EURC Contract Addresses (Arc)
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_EURC_ADDRESS=0x...

# Agent Configuration
AGENT_PRIVATE_KEY=0x...
AGENT_WALLET_ID=wallet_id

# Polymarket Integration
POLYMARKET_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/polymarket/polymarket
POLYMARKET_API_URL=https://clob.polymarket.com

# Market Mirroring
MARKET_MIRROR_CONTRACT_ADDRESS=0x...
DEFAULT_ORACLE_ADDRESS=0x...
```

### 3. Smart Contract Setup

**Project Structure:**
```
predictflow/
├── contracts/
│   ├── MarketFactory.sol
│   ├── PredictionMarket.sol
│   ├── MarketMirror.sol
│   ├── AgentMarketMaker.sol
│   ├── LiquidityPool.sol
│   ├── AgentRegistry.sol
│   └── SettlementContract.sol
├── scripts/
│   ├── deploy.js
│   └── setup.js
├── test/
│   └── PredictionMarket.test.js
├── hardhat.config.js
└── package.json
```

**Hardhat Config:**
```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arc: {
      url: process.env.ARC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: parseInt(process.env.ARC_CHAIN_ID),
    },
  },
};
```

---

## 🔄 Polymarket Market Mirroring Integration

### Overview

Instead of creating markets manually, we'll mirror markets from Polymarket to save time and get immediate distribution. This allows us to:
- Access thousands of existing markets instantly
- Focus on AI agent liquidity provision (our differentiator)
- Demonstrate better execution than Polymarket
- Meet all hackathon requirements on Arc

### Architecture

```
Polymarket (Ethereum/Polygon)
    ↓ (API/Subgraph)
Market Mirroring Service
    ↓ (Creates markets on Arc)
PredictFlow Markets (Arc)
    ↓ (Agents provide liquidity)
Users Trade on Arc
```

### Polymarket Resources

- **API Docs:** https://www.polymarketexchange.com/developers.html
- **TypeScript SDK:** https://github.com/polymarket/clob-client
- **GraphQL Subgraph:** https://api.thegraph.com/subgraphs/name/polymarket/polymarket
- **Status:** https://status.polymarket.com
- **Community SDK:** https://polymarket-data.com

### Key Benefits

1. **Immediate Distribution:** Access to Polymarket's market catalog
2. **Time Savings:** No manual market creation needed
3. **Better Liquidity:** Agents provide deeper liquidity than Polymarket
4. **Faster Settlement:** Sub-second finality on Arc vs Polymarket
5. **Lower Fees:** USDC gas on Arc vs ETH gas on Polymarket
6. **Cross-Chain:** Users bridge from Ethereum/Polygon to Arc

### Implementation Flow

1. **Fetch Markets:** Use Polymarket subgraph to get active markets
2. **Mirror Market:** Create PredictFlow market on Arc via MarketMirror contract
3. **Create Treasury:** Gateway creates treasury wallet for market
4. **Agent Allocation:** Agents automatically provide liquidity
5. **Price Sync:** Agents sync prices from Polymarket and provide better quotes
6. **User Trading:** Users trade on PredictFlow with better execution

---

## 🏗️ Day 1: Core Infrastructure + Polymarket Integration (8 hours)

### Morning: Smart Contracts + Mirroring (4 hours)

**1. MarketFactory Contract (30 min)**
```solidity
// contracts/MarketFactory.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarketFactory {
    address public usdc;
    address public eurc;
    
    struct Market {
        string question;
        uint256 endDate;
        address oracle;
        address currency; // USDC or EURC
        bool settled;
    }
    
    Market[] public markets;
    
    event MarketCreated(uint256 indexed marketId, string question);
    
    function createMarket(
        string memory question,
        uint256 endDate,
        address oracle,
        address currency
    ) external returns (uint256) {
        require(currency == usdc || currency == eurc, "Invalid currency");
        require(endDate > block.timestamp, "Invalid end date");
        
        uint256 marketId = markets.length;
        markets.push(Market({
            question: question,
            endDate: endDate,
            oracle: oracle,
            currency: currency,
            settled: false
        }));
        
        emit MarketCreated(marketId, question);
        return marketId;
    }
}
```

**2. MarketMirror Contract (1 hour)**
```solidity
// contracts/MarketMirror.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MarketFactory.sol";

contract MarketMirror {
    MarketFactory public marketFactory;
    IERC20 public usdc;
    
    mapping(string => uint256) public polymarketToPredictFlow;
    mapping(uint256 => string) public predictFlowToPolymarket;
    
    struct MirrorInfo {
        string polymarketId;
        string polymarketSlug;
        uint256 mirroredAt;
        bool active;
        address treasuryWallet;
    }
    
    mapping(uint256 => MirrorInfo) public mirrorInfo;
    
    event MarketMirrored(
        string indexed polymarketId,
        uint256 indexed predictFlowMarketId,
        string question
    );
    
    constructor(address _marketFactory, address _usdc) {
        marketFactory = MarketFactory(_marketFactory);
        usdc = IERC20(_usdc);
    }
    
    function mirrorMarket(
        string memory polymarketId,
        string memory question,
        uint256 endDate,
        address oracle,
        address treasuryWallet
    ) external returns (uint256) {
        require(polymarketToPredictFlow[polymarketId] == 0, "Already mirrored");
        require(endDate > block.timestamp, "Invalid end date");
        
        uint256 marketId = marketFactory.createMarket(
            question,
            endDate,
            oracle,
            address(usdc)
        );
        
        polymarketToPredictFlow[polymarketId] = marketId;
        predictFlowToPolymarket[marketId] = polymarketId;
        
        mirrorInfo[marketId] = MirrorInfo({
            polymarketId: polymarketId,
            polymarketSlug: "",
            mirroredAt: block.timestamp,
            active: true,
            treasuryWallet: treasuryWallet
        });
        
        emit MarketMirrored(polymarketId, marketId, question);
        
        return marketId;
    }
    
    function getPredictFlowMarket(string memory polymarketId) 
        external 
        view 
        returns (uint256) 
    {
        return polymarketToPredictFlow[polymarketId];
    }
    
    function isMirrored(string memory polymarketId) 
        external 
        view 
        returns (bool) 
    {
        return polymarketToPredictFlow[polymarketId] != 0;
    }
}
```

**3. PredictionMarket Contract (1.5 hours)**
```solidity
// contracts/PredictionMarket.sol
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PredictionMarket {
    IERC20 public currency; // USDC or EURC
    uint256 public yesShares;
    uint256 public noShares;
    bool public settled;
    bool public outcome;
    
    mapping(address => uint256) public yesBalances;
    mapping(address => uint256) public noBalances;
    
    event Trade(address indexed trader, bool outcome, uint256 amount);
    event Settled(bool outcome);
    
    function buyShares(bool outcome, uint256 amount) external {
        require(!settled, "Market settled");
        require(currency.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // AMM: x * y = k
        uint256 k = yesShares * noShares;
        if (outcome) {
            uint256 newYes = yesShares + amount;
            uint256 newNo = k / newYes;
            uint256 noToBurn = noShares - newNo;
            noShares = newNo;
            yesShares = newYes;
            yesBalances[msg.sender] += amount;
            if (noToBurn > 0) {
                // Burn no shares
            }
        } else {
            uint256 newNo = noShares + amount;
            uint256 newYes = k / newNo;
            uint256 yesToBurn = yesShares - newYes;
            yesShares = newYes;
            noShares = newNo;
            noBalances[msg.sender] += amount;
            if (yesToBurn > 0) {
                // Burn yes shares
            }
        }
        
        emit Trade(msg.sender, outcome, amount);
    }
    
    function getPrice(bool outcome) public view returns (uint256) {
        uint256 total = yesShares + noShares;
        if (total == 0) return 50e18; // 50% default
        return outcome ? (yesShares * 100e18) / total : (noShares * 100e18) / total;
    }
    
    function settle(bool _outcome) external {
        require(!settled, "Already settled");
        settled = true;
        outcome = _outcome;
        emit Settled(_outcome);
    }
}
```

**4. Polymarket Integration Setup (1 hour)**
```typescript
// lib/polymarket-integration.ts
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const POLYMARKET_SUBGRAPH = process.env.POLYMARKET_SUBGRAPH_URL || 
  'https://api.thegraph.com/subgraphs/name/polymarket/polymarket';

export class PolymarketIntegration {
  private client: ApolloClient<any>;
  
  constructor() {
    this.client = new ApolloClient({
      uri: POLYMARKET_SUBGRAPH,
      cache: new InMemoryCache(),
    });
  }
  
  async fetchActiveMarkets(limit: number = 50) {
    const query = gql`
      query GetMarkets($first: Int!) {
        markets(
          where: { 
            active: true,
            closed: false
          },
          orderBy: volume,
          orderDirection: desc,
          first: $first
        ) {
          id
          question
          slug
          endDate
          outcomes {
            id
            title
            price
          }
          volume
          liquidity
          image
          description
          conditionId
        }
      }
    `;
    
    const result = await this.client.query({
      query,
      variables: { first: limit },
    });
    
    return result.data.markets;
  }
  
  async getMarketDetails(marketId: string) {
    const query = gql`
      query GetMarket($id: ID!) {
        market(id: $id) {
          id
          question
          slug
          endDate
          outcomes {
            id
            title
            price
            volume
          }
          volume
          liquidity
          image
          description
          conditionId
        }
      }
    `;
    
    const result = await this.client.query({
      query,
      variables: { id: marketId },
    });
    
    return result.data.market;
  }
}
```

**5. AgentRegistry Contract (30 min)**
```solidity
// contracts/AgentRegistry.sol
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        address agentAddress;
        string name;
        uint256 capital;
        uint256 reputation;
        bool verified;
    }
    
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public agentIds;
    uint256 public agentCount;
    
    event AgentRegistered(uint256 indexed agentId, address agentAddress);
    
    function registerAgent(string memory name) external returns (uint256) {
        uint256 agentId = agentCount++;
        agents[agentId] = Agent({
            agentAddress: msg.sender,
            name: name,
            capital: 0,
            reputation: 100,
            verified: false
        });
        agentIds[msg.sender] = agentId;
        emit AgentRegistered(agentId, msg.sender);
        return agentId;
    }
}
```

### Afternoon: Mirroring Service + Frontend (4 hours)

**1. Market Mirroring Service (2 hours)**
```typescript
// lib/market-mirroring-service.ts
import { PolymarketIntegration } from './polymarket-integration';
import { MarketMirror__factory } from '@/contracts';
import { CircleGateway } from './circle-gateway';
import { ethers } from 'ethers';

export class MarketMirroringService {
  private polymarket: PolymarketIntegration;
  private marketMirror: ethers.Contract;
  private gateway: CircleGateway;
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  
  constructor(
    provider: ethers.Provider,
    signer: ethers.Signer,
    marketMirrorAddress: string
  ) {
    this.provider = provider;
    this.signer = signer;
    this.polymarket = new PolymarketIntegration();
    this.marketMirror = MarketMirror__factory.connect(marketMirrorAddress, signer);
    this.gateway = new CircleGateway();
  }
  
  async autoMirrorTopMarkets(count: number = 10) {
    const markets = await this.polymarket.fetchActiveMarkets(count);
    const mirroredMarkets = [];
    
    for (const market of markets) {
      try {
        const isMirrored = await this.marketMirror.isMirrored(market.id);
        if (isMirrored) continue;
        
        const treasuryWallet = await this.gateway.createWallet('USDC');
        const endDate = new Date(market.endDate).getTime() / 1000;
        const oracleAddress = process.env.DEFAULT_ORACLE_ADDRESS || '0x...';
        
        const tx = await this.marketMirror.mirrorMarket(
          market.id,
          market.question,
          Math.floor(endDate),
          oracleAddress,
          treasuryWallet
        );
        
        await tx.wait();
        
        const receipt = await this.provider.getTransactionReceipt(tx.hash);
        const event = this.marketMirror.interface.parseLog(receipt.logs[0]);
        const predictFlowMarketId = event.args.predictFlowMarketId;
        
        mirroredMarkets.push({
          polymarketId: market.id,
          predictFlowMarketId: predictFlowMarketId.toString(),
          question: market.question,
          treasuryWallet
        });
        
      } catch (error) {
        console.error(`Failed to mirror market ${market.id}:`, error);
      }
    }
    
    return mirroredMarkets;
  }
  
  async mirrorMarket(polymarketId: string) {
    const market = await this.polymarket.getMarketDetails(polymarketId);
    const treasuryWallet = await this.gateway.createWallet('USDC');
    const oracleAddress = process.env.DEFAULT_ORACLE_ADDRESS || '0x...';
    const endDate = new Date(market.endDate).getTime() / 1000;
    
    const tx = await this.marketMirror.mirrorMarket(
      market.id,
      market.question,
      Math.floor(endDate),
      oracleAddress,
      treasuryWallet
    );
    
    await tx.wait();
    return tx.hash;
  }
  
  async syncPrices(predictFlowMarketId: number) {
    const polymarketId = await this.marketMirror.predictFlowToPolymarket(predictFlowMarketId);
    const polymarketMarket = await this.polymarket.getMarketDetails(polymarketId);
    
    const yesPrice = polymarketMarket.outcomes.find(o => o.title === 'Yes')?.price || 0.5;
    const noPrice = polymarketMarket.outcomes.find(o => o.title === 'No')?.price || 0.5;
    
    return {
      yesPrice,
      noPrice,
      liquidity: polymarketMarket.liquidity,
      volume: polymarketMarket.volume
    };
  }
}
```

**2. Frontend Setup (2 hours)**

**1. Dashboard Starter Integration**

The [Next.js Shadcn Dashboard Starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) provides:
- ✅ Next.js 15 App Router setup
- ✅ Shadcn UI components pre-configured
- ✅ Dashboard layout with sidebar/navigation
- ✅ Tanstack tables with server-side filtering
- ✅ Forms with react-hook-form + zod
- ✅ Recharts integration for analytics
- ✅ Zustand for state management
- ✅ Command+k interface (kbar)
- ✅ Feature-based organization

**Adaptation Strategy:**
- Keep the dashboard layout structure
- Replace "Product" pages with "Markets" pages
- Adapt dashboard analytics for market/agent metrics
- Use table components for markets list
- Use form components for market mirroring
- Add Web3 wallet integration (Wagmi)

**2. Updated Project Structure**
```
predictflow-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth routes (from dashboard starter)
│   │   ├── (dashboard)/        # Dashboard route group
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx         # Overview dashboard
│   │   │   ├── markets/         # Markets pages
│   │   │   │   ├── page.tsx    # Markets list (like product page)
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx # Market detail
│   │   │   │   └── mirror/
│   │   │   │       └── page.tsx # Mirror market form
│   │   │   ├── agents/          # Agent dashboard
│   │   │   │   └── page.tsx
│   │   │   └── trading/         # Trading interface
│   │   │       └── page.tsx
│   │   └── api/                 # API routes
│   │       ├── polymarket/
│   │       │   └── markets/
│   │       │       └── route.ts
│   │       └── mirror/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                  # Shadcn UI components (from starter)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components (from starter)
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── nav.tsx
│   │   ├── markets/             # PredictFlow-specific
│   │   │   ├── MarketCard.tsx
│   │   │   ├── MarketTable.tsx  # Based on ProductTable from starter
│   │   │   ├── MarketChart.tsx  # Price charts
│   │   │   ├── TradingInterface.tsx
│   │   │   └── MirrorMarketForm.tsx
│   │   └── agents/
│   │       ├── AgentCard.tsx
│   │       ├── AgentDashboard.tsx
│   │       └── AgentPerformance.tsx
│   ├── features/                # Feature-based (from starter)
│   │   ├── markets/
│   │   │   ├── components/
│   │   │   ├── actions/         # Server actions
│   │   │   ├── schemas/         # Zod schemas
│   │   │   └── utils/
│   │   └── agents/
│   ├── lib/
│   │   ├── wagmi.ts            # Wagmi config
│   │   ├── contracts.ts       # Contract ABIs
│   │   ├── circle-api.ts       # Circle API client
│   │   ├── polymarket-integration.ts
│   │   └── utils.ts           # From starter
│   ├── hooks/
│   │   ├── useMarket.ts
│   │   ├── useAgent.ts
│   │   └── use-debounce.ts    # From starter
│   ├── stores/                 # Zustand stores (from starter)
│   │   ├── dashboard-store.ts # Adapted from starter
│   │   └── market-store.ts    # New
│   └── types/
│       ├── market.ts
│       └── agent.ts
```

**3. Wagmi Configuration**
```typescript
// src/lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { getDefaultConfig } from '@wagmi/core'
import { arc } from 'wagmi/chains'

// Arc chain configuration (update with actual Arc chain config)
const arcChain = {
  id: parseInt(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '12345'),
  name: 'Arc',
  network: 'arc',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || ''],
    },
  },
} as const

export const config = createConfig(
  getDefaultConfig({
    chains: [arcChain],
    transports: {
      [arcChain.id]: http(),
    },
    ssr: true,
  })
)
```

**4. Dashboard Layout Integration**
```typescript
// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { WalletConnect } from '@/components/wallet/wallet-connect'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
          <WalletConnect />
        </Header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**5. Navigation Menu (Adapted from Dashboard Starter)**
```typescript
// src/components/layout/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Bot, 
  Wallet,
  BarChart3 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Markets', href: '/dashboard/markets', icon: TrendingUp },
  { title: 'Agents', href: '/dashboard/agents', icon: Bot },
  { title: 'Trading', href: '/dashboard/trading', icon: BarChart3 },
  { title: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="w-64 border-r bg-background">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

**6. Dashboard Overview Page (Adapted from Starter)**
```typescript
// src/app/(dashboard)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MarketStats } from '@/components/markets/market-stats'
import { AgentStats } from '@/components/agents/agent-stats'
import { RecentMarkets } from '@/components/markets/recent-markets'
import { MarketChart } from '@/components/markets/market-chart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of markets, agents, and trading activity
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              Providing liquidity
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              USDC traded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Spread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5%</div>
            <p className="text-xs text-muted-foreground">
              Better than Polymarket
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentStats />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Markets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Markets</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentMarkets />
        </CardContent>
      </Card>
    </div>
  )
}
```

**7. Markets Table (Based on Product Table from Starter)**
```typescript
// src/app/(dashboard)/markets/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MarketMirrorButton } from '@/components/markets/market-mirror-button'
import { formatDistanceToNow } from 'date-fns'

type Market = {
  id: string
  question: string
  yesPrice: number
  noPrice: number
  volume: number
  liquidity: number
  endDate: string
  isMirrored: boolean
  predictFlowMarketId?: number
}

const columns: ColumnDef<Market>[] = [
  {
    accessorKey: 'question',
    header: 'Market',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('question')}</div>
    ),
  },
  {
    accessorKey: 'yesPrice',
    header: 'Yes Price',
    cell: ({ row }) => (
      <div className="text-green-600">
        {(row.getValue('yesPrice') * 100).toFixed(2)}%
      </div>
    ),
  },
  {
    accessorKey: 'noPrice',
    header: 'No Price',
    cell: ({ row }) => (
      <div className="text-red-600">
        {(row.getValue('noPrice') * 100).toFixed(2)}%
      </div>
    ),
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
    cell: ({ row }) => (
      <div>${(row.getValue('volume') as number).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: 'liquidity',
    header: 'Liquidity',
    cell: ({ row }) => (
      <div>${(row.getValue('liquidity') as number).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'Ends',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.getValue('endDate')), {
          addSuffix: true,
        })}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isMirrored = row.original.isMirrored
      return (
        <Badge variant={isMirrored ? 'default' : 'secondary'}>
          {isMirrored ? 'Mirrored' : 'Not Mirrored'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const market = row.original
      return (
        <MarketMirrorButton
          market={market}
          isMirrored={market.isMirrored}
          predictFlowMarketId={market.predictFlowMarketId}
        />
      )
    },
  },
]

export default function MarketsPage() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ['markets', search],
    queryFn: async () => {
      const response = await fetch(
        `/api/polymarket/markets${search ? `?search=${search}` : ''}`
      )
      return response.json()
    },
  })

  const table = useReactTable({
    data: markets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">
            Browse and mirror markets from Polymarket
          </p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/markets/mirror'}>
          Mirror Market
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search markets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading markets...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No markets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

**8. Market Mirroring Form (Based on Form Patterns from Starter)**
```typescript
// src/app/(dashboard)/markets/mirror/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MarketMirror__factory } from '@/lib/contracts'
import { toast } from '@/components/ui/use-toast'

const mirrorFormSchema = z.object({
  polymarketId: z.string().min(1, 'Please select a market'),
  oracle: z.string().min(1, 'Oracle address is required'),
})

type MirrorFormValues = z.infer<typeof mirrorFormSchema>

export default function MirrorMarketPage() {
  const { data: markets = [] } = useQuery({
    queryKey: ['polymarket-markets'],
    queryFn: async () => {
      const response = await fetch('/api/polymarket/markets')
      return response.json()
    },
  })

  const form = useForm<MirrorFormValues>({
    resolver: zodResolver(mirrorFormSchema),
    defaultValues: {
      polymarketId: '',
      oracle: process.env.NEXT_PUBLIC_DEFAULT_ORACLE_ADDRESS || '',
    },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  async function onSubmit(data: MirrorFormValues) {
    const selectedMarket = markets.find((m: any) => m.id === data.polymarketId)
    
    if (!selectedMarket) {
      toast({
        title: 'Error',
        description: 'Selected market not found',
        variant: 'destructive',
      })
      return
    }

    // Call mirror API endpoint
    try {
      const response = await fetch('/api/mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          polymarketId: data.polymarketId,
          oracle: data.oracle,
        }),
      })

      const result = await response.json()
      
      if (result.txHash) {
        toast({
          title: 'Success',
          description: 'Market mirrored successfully!',
        })
        // Redirect to market page
        window.location.href = `/dashboard/markets/${result.marketId}`
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mirror market',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mirror Market</h1>
        <p className="text-muted-foreground">
          Mirror a market from Polymarket to PredictFlow
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="polymarketId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Market</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a market to mirror" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {markets.map((market: any) => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a market from Polymarket to mirror
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oracle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oracle Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormDescription>
                  Address of the oracle contract for market settlement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending || isConfirming}>
            {isPending || isConfirming ? 'Mirroring...' : 'Mirror Market'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
```

**9. Component Mapping from Dashboard Starter**

| Dashboard Starter Component | PredictFlow Adaptation |
|----------------------------|------------------------|
| `ProductTable` | `MarketTable` - Markets list with filtering |
| `ProductForm` | `MirrorMarketForm` - Market mirroring form |
| Dashboard Overview | Markets/Agents overview with stats |
| Charts (Recharts) | Market price charts, volume charts |
| Kanban Board | Could adapt for agent task management |
| Command+K (kbar) | Global search for markets/agents |
| Zustand stores | Market state, agent state |
| Server Actions | Market mirroring, agent operations |

**10. Key Integration Steps**

1. **Clone Dashboard Starter:**
   ```bash
   git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git predictflow-frontend
   cd predictflow-frontend
   pnpm install
   ```

2. **Remove Unused Features:**
   - Remove Clerk auth (or keep if needed)
   - Remove Product pages
   - Keep layout, UI components, utilities

3. **Add PredictFlow Dependencies:**
   ```bash
   pnpm add wagmi viem @wagmi/core
   pnpm add @apollo/client graphql
   ```

4. **Adapt Components:**
   - Copy `ProductTable` → adapt to `MarketTable`
   - Copy form patterns → adapt to `MirrorMarketForm`
   - Adapt dashboard stats for markets/agents
   - Add wallet connection components

5. **Update Navigation:**
   - Replace "Products" with "Markets"
   - Add "Agents" and "Trading" routes
   - Add wallet connection to header

**11. Additional Resources**

- **Dashboard Starter Repo:** https://github.com/Kiranism/next-shadcn-dashboard-starter
- **Demo:** https://shadcn-dashboard.kiranism.dev
- **Shadcn UI Docs:** https://ui.shadcn.com
- **Tanstack Table:** https://tanstack.com/table
- **React Hook Form:** https://react-hook-form.com

---

## 📦 Dashboard Starter Integration Summary

### What We're Using from the Dashboard Starter

1. **Layout System:**
   - Sidebar navigation (adapted for PredictFlow routes)
   - Header with wallet connection
   - Dashboard layout wrapper

2. **UI Components (Shadcn):**
   - All base UI components (Button, Card, Input, Table, etc.)
   - Form components with react-hook-form + zod
   - Chart components (Recharts integration)
   - Badge, Dialog, Select, etc.

3. **Data Tables:**
   - Tanstack Table setup with server-side filtering
   - Search params management with Nuqs
   - Pagination and sorting

4. **State Management:**
   - Zustand stores (adapted for market/agent state)
   - React Query for server state

5. **Forms:**
   - Form validation patterns with Zod
   - React Hook Form integration
   - Error handling patterns

6. **Utilities:**
   - Date formatting (date-fns)
   - Debouncing hooks
   - TypeScript utilities

### What We're Adding for PredictFlow

1. **Web3 Integration:**
   - Wagmi configuration for Arc network
   - Wallet connection components
   - Contract interaction hooks

2. **PredictFlow-Specific Components:**
   - Market mirroring interface
   - Trading interface
   - Agent dashboard
   - Market price charts

3. **API Integration:**
   - Polymarket GraphQL client
   - Circle API integration
   - Market mirroring service

### Quick Start Checklist

- [ ] Clone dashboard starter repository
- [ ] Install PredictFlow dependencies (Wagmi, Apollo Client, etc.)
- [ ] Set up Wagmi config for Arc network
- [ ] Adapt sidebar navigation for PredictFlow routes
- [ ] Create Markets table (based on Product table)
- [ ] Create Market mirroring form
- [ ] Add wallet connection to header
- [ ] Set up Polymarket API routes
- [ ] Create dashboard overview with market/agent stats
- [ ] Add trading interface components

---
  useEffect(() => {
    async function fetchMarkets() {
      const response = await fetch('/api/polymarket/markets')
      const markets = await response.json()
      setPolymarketMarkets(markets)
      
      // Check which are mirrored
      for (const market of markets) {
        const isMirrored = await checkIfMirrored(market.id)
        if (isMirrored) {
          const predictFlowId = await getPredictFlowMarket(market.id)
          mirroredMarkets.set(market.id, predictFlowId)
        }
      }
      setMirroredMarkets(new Map(mirroredMarkets))
    }
    
    fetchMarkets()
  }, [])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markets</h1>
      <p className="text-muted-foreground mb-4">
        Markets from Polymarket - Mirror to PredictFlow for better liquidity
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {polymarketMarkets.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            isMirrored={mirroredMarkets.has(market.id)}
            predictFlowMarketId={mirroredMarkets.get(market.id)}
          />
        ))}
      </div>
    </div>
  )
}

function MarketCard({ market, isMirrored, predictFlowMarketId }) {
  const handleMirror = async () => {
    const response = await fetch('/api/mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ polymarketId: market.id }),
    })
    const { txHash } = await response.json()
    // Show success message
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{market.question}</CardTitle>
        <CardDescription>
          Source: Polymarket
          {isMirrored && (
            <Badge className="ml-2">Mirrored on PredictFlow</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <span>Yes: {market.outcomes?.find(o => o.title === 'Yes')?.price || 'N/A'}</span>
          <span>No: {market.outcomes?.find(o => o.title === 'No')?.price || 'N/A'}</span>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Liquidity: ${market.liquidity || 0}
        </div>
        {isMirrored ? (
          <Button 
            onClick={() => window.location.href = `/markets/${predictFlowMarketId}`}
            className="w-full"
          >
            Trade on PredictFlow (Better Liquidity)
          </Button>
        ) : (
          <Button onClick={handleMirror} className="w-full">
            Mirror to PredictFlow
          </Button>
        )}
      </div>
    </Card>
  )
}
```

**4. API Routes**
```typescript
// app/api/polymarket/markets/route.ts
import { NextResponse } from 'next/server'
import { PolymarketIntegration } from '@/lib/polymarket-integration'

export async function GET() {
  const polymarket = new PolymarketIntegration()
  const markets = await polymarket.fetchActiveMarkets(50)
  return NextResponse.json(markets)
}

// app/api/mirror/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MarketMirroringService } from '@/lib/market-mirroring-service'

export async function POST(request: NextRequest) {
  const { polymarketId } = await request.json()
  
  // Initialize service (you'll need to pass provider/signer)
  // const mirroringService = new MarketMirroringService(...)
  // const txHash = await mirroringService.mirrorMarket(polymarketId)
  
  return NextResponse.json({ txHash: '0x...' })
}
```

---

## 🤖 Day 2: Agent System & Integration (8 hours)

### Morning: Agent Implementation (4 hours)

**1. Agent Service Setup**
```typescript
// lib/agent-service.ts
import { ethers } from 'ethers'
import { AgentRegistry__factory } from '@/contracts'

export class AgentService {
  private provider: ethers.Provider
  private signer: ethers.Signer
  private agentId: number
  
  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider
    this.signer = signer
  }
  
  async registerAgent(name: string): Promise<number> {
    const registry = AgentRegistry__factory.connect(REGISTRY_ADDRESS, this.signer)
    const tx = await registry.registerAgent(name)
    await tx.wait()
    const receipt = await this.provider.getTransactionReceipt(tx.hash)
    // Parse agentId from events
    return this.agentId
  }
  
  async provideLiquidity(marketId: number, amount: bigint) {
    // Agent provides liquidity to market
  }
  
  async updateQuotes(marketId: number, buyPrice: bigint, sellPrice: bigint) {
    // Update quotes on-chain
  }
}
```

**2. Agent Market Making Logic (with Polymarket Price Sync)**
```typescript
// lib/agent-strategy.ts
import { MarketMirroringService } from './market-mirroring-service'

export class AgentStrategy {
  private mirroringService: MarketMirroringService
  
  constructor(mirroringService: MarketMirroringService) {
    this.mirroringService = mirroringService
  }
  
  async generateQuotes(market: Market): Promise<{ buyPrice: number, sellPrice: number }> {
    // For mirrored markets, sync prices from Polymarket
    if (market.isMirrored) {
      const polymarketPrices = await this.mirroringService.syncPrices(market.id)
      const currentPrice = polymarketPrices.yesPrice
      
      // Provide better prices than Polymarket (tighter spread)
      const baseSpread = 0.005 // 0.5% (tighter than Polymarket)
      const buyPrice = currentPrice - (baseSpread / 2)
      const sellPrice = currentPrice + (baseSpread / 2)
      
      return { buyPrice, sellPrice }
    }
    
    // For native markets, use standard logic
    const volatility = this.calculateVolatility(market)
    const baseSpread = 0.01 // 1%
    const spread = baseSpread + (volatility * 0.5)
    
    const currentPrice = market.currentPrice
    const buyPrice = currentPrice - (spread / 2)
    const sellPrice = currentPrice + (spread / 2)
    
    return { buyPrice, sellPrice }
  }
  
  private calculateVolatility(market: Market): number {
    // Calculate market volatility
    return 0.1 // Placeholder
  }
}
```

**3. Agent Background Service**
```typescript
// lib/agent-background.ts
export class AgentBackgroundService {
  private interval: NodeJS.Timeout | null = null
  
  start() {
    this.interval = setInterval(async () => {
      await this.updateAllMarkets()
    }, 5000) // Update every 5 seconds
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
  
  private async updateAllMarkets() {
    const markets = await this.getActiveMarkets()
    for (const market of markets) {
      await this.updateMarketQuotes(market)
    }
  }
}
```

### Afternoon: Circle API Integration (4 hours)

**1. Gateway Integration**
```typescript
// lib/circle-gateway.ts
export class CircleGateway {
  private apiKey: string
  private baseUrl = 'https://api.circle.com/v1'
  
  async createWallet(currency: 'USDC' | 'EURC'): Promise<string> {
    const response = await fetch(`${this.baseUrl}/w3s/wallets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotencyKey: crypto.randomUUID(),
        description: `Market Treasury - ${currency}`,
      }),
    })
    const data = await response.json()
    return data.data.walletId
  }
  
  async transferFunds(
    walletId: string,
    destination: string,
    amount: string,
    currency: 'USDC' | 'EURC'
  ) {
    const response = await fetch(`${this.baseUrl}/w3s/wallets/${walletId}/transfers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotencyKey: crypto.randomUUID(),
        destination: destination,
        amount: amount,
        currency: currency,
      }),
    })
    return response.json()
  }
}
```

**2. Wallets Integration**
```typescript
// lib/circle-wallets.ts
export class CircleWallets {
  async createAgentWallet(agentId: string): Promise<string> {
    // Create wallet for agent via Circle Wallets API
  }
  
  async enableAutonomousOperations(walletId: string) {
    // Enable agent to operate wallet autonomously
  }
}
```

**3. Bridge Kit Integration**
```typescript
// lib/circle-bridge.ts
export class CircleBridge {
  async bridgeUSDC(
    sourceChain: string,
    destinationChain: string,
    amount: string
  ): Promise<string> {
    // Bridge USDC using Circle Bridge Kit
  }
}
```

---

## 🎨 Day 3: UI/UX & Demo Prep (8 hours)

### Morning: Complete UI (4 hours)

**1. Market Creation Page**
```typescript
// app/markets/create/page.tsx
'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { MarketFactory__factory } from '@/contracts'

export default function CreateMarketPage() {
  const { writeContract } = useWriteContract()
  const [question, setQuestion] = useState('')
  const [currency, setCurrency] = useState<'USDC' | 'EURC'>('USDC')
  
  const handleCreate = async () => {
    const endDate = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    await writeContract({
      address: MARKET_FACTORY_ADDRESS,
      abi: MarketFactory__factory.abi,
      functionName: 'createMarket',
      args: [question, endDate, ORACLE_ADDRESS, CURRENCY_ADDRESSES[currency]],
    })
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Market</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Will Q4 revenue exceed $10M?"
        className="w-full p-2 border rounded"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as 'USDC' | 'EURC')}
        className="mt-4 p-2 border rounded"
      >
        <option value="USDC">USDC</option>
        <option value="EURC">EURC</option>
      </select>
      <button onClick={handleCreate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Create Market
      </button>
    </div>
  )
}
```

**2. Trading Interface**
```typescript
// components/TradingInterface.tsx
'use client'

import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { PredictionMarket__factory } from '@/contracts'

export function TradingInterface({ market }: { market: Market }) {
  const { writeContract } = useWriteContract()
  const [amount, setAmount] = useState('')
  const [outcome, setOutcome] = useState<boolean>(true)
  
  const handleTrade = async () => {
    await writeContract({
      address: market.address,
      abi: PredictionMarket__factory.abi,
      functionName: 'buyShares',
      args: [outcome, ethers.parseUnits(amount, 6)], // USDC has 6 decimals
    })
  }
  
  return (
    <div className="border rounded p-4">
      <h3 className="text-lg font-semibold mb-4">Trade</h3>
      <div className="space-y-4">
        <div>
          <label>Outcome</label>
          <select
            value={outcome.toString()}
            onChange={(e) => setOutcome(e.target.value === 'true')}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label>Amount ({market.currency})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
        </div>
        <button onClick={handleTrade} className="w-full px-4 py-2 bg-green-500 text-white rounded">
          Trade
        </button>
      </div>
    </div>
  )
}
```

**3. Agent Dashboard**
```typescript
// app/agents/page.tsx
'use client'

import { useReadContract } from 'wagmi'
import { AgentRegistry__factory } from '@/contracts'

export default function AgentsPage() {
  const { data: agentCount } = useReadContract({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AgentRegistry__factory.abi,
    functionName: 'agentCount',
  })
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>{agentCount?.toString() || 0}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Liquidity</CardTitle>
            <CardDescription>$1.2M USDC</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
            <CardDescription>$5.4M USDC</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
```

### Afternoon: Demo Preparation (4 hours)

**1. Demo Script (Updated for Polymarket Mirroring)**
```markdown
# Demo Flow (5 minutes)

1. Problem Statement (30 seconds)
   - Show Polymarket markets with thin liquidity
   - "Institutions can't participate due to liquidity issues"
   - Highlight slippage on large orders

2. Solution Overview (1 minute)
   - "PredictFlow mirrors Polymarket markets on Arc"
   - "AI agents provide deep liquidity automatically"
   - "Better execution, faster settlement, lower fees"
   - Show PredictFlow interface with Polymarket markets

3. Live Demo (2.5 minutes)

   Step 1: Mirror Market (30 seconds)
   - Show top Polymarket markets
   - Click "Mirror to PredictFlow"
   - Market created on Arc via MarketMirror contract
   - Treasury wallet created via Gateway
   - Show transaction on Arc

   Step 2: Agent Liquidity Provision (45 seconds)
   - Agent syncs prices from Polymarket
   - Agent provides better liquidity on PredictFlow
   - Show real-time quote updates (sub-second on Arc)
   - Show agent-to-agent communication:
     - "Agent 1: Synced prices from Polymarket"
     - "Agent 2: Providing liquidity with 0.5% spread"
     - "Agent 3: Coordinating with Agent 1"

   Step 3: User Trades (30 seconds)
   - User bridges USDC from Ethereum → Arc (Bridge Kit)
   - User trades on PredictFlow mirror
   - Show better execution vs Polymarket
   - Sub-second finality on Arc
   - No slippage (agents provide deep liquidity)

   Step 4: Settlement (30 seconds)
   - Market settles on Arc
   - Funds distributed via Gateway
   - Agent performance updated on-chain

4. Key Features (1 minute)
   - Market mirroring from Polymarket
   - AI agent liquidity provision
   - Cross-chain participation (Bridge Kit)
   - Better execution than Polymarket
   - Treasury management (Gateway)
   - Embedded wallets (Circle Wallets)

5. Impact & Vision (30 seconds)
   - Solves liquidity problem
   - Leverages existing market distribution
   - Built on Arc for institutional use
   - AI agents as market makers
```

**2. Test Data Setup**
```typescript
// scripts/setup-demo.ts
export async function setupDemo() {
  // Create test markets
  // Deploy test agents
  // Fund test wallets
  // Set up test data
}
```

**3. Error Handling**
```typescript
// lib/error-handling.ts
export function handleError(error: Error) {
  console.error('Error:', error)
  // Show user-friendly error message
  // Log to error tracking service
}
```

---

## 🚀 Deployment Checklist

### Smart Contracts
- [ ] Deploy to Arc testnet
- [ ] Verify contracts on block explorer
- [ ] Test all contract functions
- [ ] Set up event listeners

### Frontend
- [ ] Deploy to Vercel/Netlify
- [ ] Configure environment variables
- [ ] Test wallet connections
- [ ] Test all user flows

### Agent System
- [ ] Deploy agent service
- [ ] Test agent registration
- [ ] Test liquidity provision
- [ ] Test quote updates

### Circle Integration
- [ ] Test Gateway API
- [ ] Test Wallets API
- [ ] Test Bridge Kit
- [ ] Test CCTP

### Polymarket Integration
- [ ] Test Polymarket subgraph connection
- [ ] Test market fetching
- [ ] Test market mirroring
- [ ] Test price syncing
- [ ] Test agent liquidity on mirrored markets

### Demo
- [ ] Prepare demo script
- [ ] Test demo flow
- [ ] Prepare backup plans
- [ ] Record demo video (backup)

---

## 📝 Key Implementation Tips

### 1. Prioritize Core Features
- Focus on market creation and trading first
- Get basic agent working before advanced features
- Use mock data if APIs are slow

### 2. Error Handling
- Always handle errors gracefully
- Show user-friendly messages
- Log errors for debugging

### 3. Testing
- Test on Arc testnet first
- Test with small amounts
- Test error cases

### 4. Performance
- Optimize contract gas usage
- Cache API responses
- Use React Query for data fetching

### 5. Documentation
- Comment your code
- Document API calls
- Keep README updated

---

## 🐛 Common Issues & Solutions

### Issue: Contract deployment fails
**Solution:** Check gas limits, RPC URL, and private key

### Issue: Circle API errors
**Solution:** Verify API keys, check rate limits, use idempotency keys

### Issue: Agent not providing liquidity
**Solution:** Check agent wallet balance, verify contract addresses, check event listeners

### Issue: Frontend not connecting to wallet
**Solution:** Check wagmi config, verify chain ID, check RPC URL

---

## 📚 Circle Sample Projects Reference

### Relevant Sample Projects for PredictFlow

Based on [Circle's Sample Projects](https://developers.circle.com/sample-projects), here are the most relevant implementations for PredictFlow:

#### 1. Autonomous Payments with AI Agents
**Relevant for:** AI Agent Market Making System
- **Replit:** https://replit.com/t/circle-developer/repls/AI-Agent-Autonomous-Payment-System/view#README.md
- **Key Features:**
  - Demonstrates autonomous USDC payments with AI agents
  - Uses developer-controlled wallets SDK
  - Shows how AI agents can operate wallets autonomously
- **Implementation Notes:**
  - Use this as reference for agent autonomous operations
  - Shows agent wallet management patterns
  - Demonstrates USDC operations for agents

#### 2. Cross-Chain USDC Telegram Bot with CCTP and Wallets
**Relevant for:** Cross-Chain Participation & CCTP Integration
- **Replit:** https://replit.com/@buildoncircle/Cross-Chain-USDC-Telegram-Bot-with-CCTP-v2-and-Circle-Wallets
- **Key Features:**
  - Cross-chain USDC transfers using CCTP
  - Circle Wallets integration
  - Multi-chain wallet operations
- **Implementation Notes:**
  - Reference for CCTP integration patterns
  - Shows cross-chain wallet operations
  - Demonstrates USDC bridging workflows

#### 3. Fast and Standard USDC Transfers Between Blockchains
**Relevant for:** CCTP Integration & Cross-Chain Transfers
- **Github:** https://github.com/circlefin/circle-cctp-crosschain-transfer
- **Replit:** https://replit.com/@buildoncircle/circle-cctp-crosschain-transfer
- **Key Features:**
  - Fast and standard CCTP transfer capabilities
  - Cross-chain USDC transfers
  - Transfer status tracking
- **Implementation Notes:**
  - Use for CCTP implementation patterns
  - Shows transfer status handling
  - Demonstrates fast vs standard transfer modes

#### 4. Pay for Network Fees with USDC
**Relevant for:** Paymaster Integration (Optional Enhancement)
- **Replit:** https://replit.com/@buildoncircle/Circle-Paymaster-Wallet
- **Key Features:**
  - Pay network (gas) fees using USDC tokens
  - Instead of chain native tokens
  - Better UX for users
- **Implementation Notes:**
  - Optional enhancement for PredictFlow
  - Allows users to pay fees in USDC
  - Improves user experience

#### 5. Create Escrow Contracts for the Gig Economy using AI and USDC
**Relevant for:** AI Agent Integration & Smart Contracts
- **Replit:** https://replit.com/@buildoncircle/Trusted-Payment-Apps-with-AI-and-USDC?v=1
- **Key Features:**
  - AI agent integration with blockchain
  - Escrow contract management
  - Autonomous operations
- **Implementation Notes:**
  - Reference for AI agent + smart contract patterns
  - Shows autonomous contract interactions
  - Demonstrates AI-driven decision making

#### 6. Create a Smart Account and Send a Gasless Transaction
**Relevant for:** Modular Wallets & Gasless Transactions
- **Github:** https://github.com/circlefin/modularwallets-web-sdk
- **Key Features:**
  - Modular wallets web SDK
  - Smart account creation
  - Gasless transactions
- **Implementation Notes:**
  - Use for modular wallet integration
  - Reference for smart account patterns
  - Shows gasless transaction implementation

#### 7. User Account Creation, Email Login, and PIN Authorization Flow
**Relevant for:** User-Controlled Wallets Integration
- **Client (React):** https://github.com/circlefin/w3s-sample-user-controlled-client-web
- **Server (Node.js):** https://github.com/circlefin/w3s-sample-user-controlled-server-node
- **Key Features:**
  - User-controlled wallets SDK
  - Email login flow
  - PIN authorization
- **Implementation Notes:**
  - Reference for user wallet creation
  - Shows authentication patterns
  - Demonstrates PIN-based security

### Sample Project Implementation Patterns

**For AI Agent Market Making:**
1. Use "Autonomous Payments with AI Agents" as base pattern
2. Adapt for market making operations (quote updates, liquidity provision)
3. Implement agent-to-agent communication on top

**For Cross-Chain Integration:**
1. Use "Cross-Chain USDC Telegram Bot" for CCTP patterns
2. Use "Fast and Standard USDC Transfers" for transfer logic
3. Integrate Bridge Kit for multi-chain participation

**For Wallet Management:**
1. Use "User Account Creation" for user wallets
2. Use "Modular Wallets" for smart accounts
3. Use "Developer-Controlled Wallets" for agent wallets

**For Treasury Management:**
1. Reference Gateway API patterns from sample projects
2. Use automated operations from escrow example
3. Implement multi-signature from smart account example

### Key Implementation Takeaways

1. **Autonomous Operations:** Sample projects show how to enable agents to operate wallets autonomously
2. **Cross-Chain:** CCTP examples demonstrate seamless cross-chain USDC transfers
3. **Wallet Types:** Different wallet types (user-controlled, developer-controlled, modular) for different use cases
4. **API Patterns:** Consistent API patterns across all Circle services
5. **Error Handling:** Sample projects include robust error handling patterns
6. **Idempotency:** All API calls use idempotency keys (important for agent operations)

---

## 📚 Resources

### Arc Network
- Arc Docs: https://docs.arc.network
- Arc RPC: Check hackathon resources
- Arc Testnet: Check hackathon resources

### Circle APIs
- Gateway API: https://developers.circle.com/docs/gateway
- Wallets API: https://developers.circle.com/docs/wallets
- Bridge Kit: https://developers.circle.com/docs/bridge-kit
- CCTP: https://developers.circle.com/cctp
- Paymaster: https://developers.circle.com/docs/paymaster
- Sample Projects: https://developers.circle.com/sample-projects

### Polymarket Integration
- Polymarket Developers: https://www.polymarketexchange.com/developers.html
- Polymarket CLOB Client: https://github.com/polymarket/clob-client
- Polymarket Subgraph: https://api.thegraph.com/subgraphs/name/polymarket/polymarket
- Polymarket Data SDK: https://polymarket-data.com
- Polymarket API Status: https://status.polymarket.com

### Development Tools
- Hardhat: https://hardhat.org
- Wagmi: https://wagmi.sh
- Next.js: https://nextjs.org
- Shadcn: https://ui.shadcn.com

---

**Good luck with the hackathon! 🚀**

