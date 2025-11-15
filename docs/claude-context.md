# PredictFlow: Context Document for Claude

This document provides comprehensive context about the PredictFlow project for AI assistants like Claude. Use this to understand the full project scope, architecture, and requirements.

---

## Project Overview

**Name:** PredictFlow / ForecastChain  
**Type:** Institutional Prediction Market Platform  
**Blockchain:** Arc Network (Layer-1 stablecoin-native blockchain)  
**Primary Currency:** USDC (USD Coin)  
**Secondary Currency:** EURC (Euro Coin)  
**Innovation:** AI agent market makers providing continuous liquidity

### Problem Statement

Prediction markets (Polymarket, Kalshi) suffer from critical liquidity problems:
- Thin liquidity makes it hard to enter/exit positions
- Large orders face significant slippage
- Institutions can't participate at scale
- Manual market making is expensive and doesn't scale

### Solution

PredictFlow solves the liquidity problem by introducing AI agent market makers that:
- Provide continuous liquidity 24/7
- Operate autonomously without human intervention
- Adapt to market conditions in real-time
- Communicate with each other to optimize liquidity
- Enable institutional-scale prediction markets

---

## Technical Architecture

### Blockchain: Arc Network

**Why Arc:**
- **Stablecoin-Native:** USDC as native gas token (predictable fees)
- **Sub-Second Finality:** Real-time market updates
- **EVM Compatible:** Use familiar Ethereum tools
- **Configurable Privacy:** Institutional-grade privacy options
- **Circle Integration:** Native access to USDC, EURC, Gateway, Wallets, Bridge Kit

**Key Features:**
- USDC/EURC as native currencies
- Built-in FX engine for currency conversion
- Low, predictable transaction fees
- High throughput for agent operations
- Institutional-grade infrastructure

### Smart Contracts (Track 1)

**1. MarketFactory Contract**
- Creates new prediction markets
- Supports USDC and EURC markets
- Conditional market creation logic
- Gas-optimized for Arc

**2. PredictionMarket Contract**
- Core trading contract
- AMM for binary outcomes (Yes/No)
- Constant product formula: `x * y = k`
- Price calculation: `price = y / (x + y)`
- Supports USDC and EURC

**3. AgentMarketMaker Contract**
- Agent market making logic
- Quote generation and updates
- Spread calculation
- Capital management

**4. LiquidityPool Contract**
- Automated liquidity pools
- Dynamic pool sizing
- Fee distribution
- Cross-market liquidity sharing

**5. AgentRegistry Contract**
- Agent registration and management
- Reputation system
- Performance tracking
- Agent capabilities

**6. SettlementContract**
- Oracle-based settlement
- Multi-oracle consensus
- Dispute resolution
- Automatic fund distribution

### Cross-Chain Integration (Track 2)

**Circle Bridge Kit:**
- Multi-chain market participation
- USDC/EURC bridging to Arc
- Global liquidity aggregation
- Cross-chain agent coordination
- Seamless user experience

**Implementation:**
- Users on any chain can participate
- Bridge Kit handles transfers automatically
- Liquidity aggregated on Arc
- Unified settlement

### Treasury Management (Track 3)

**Circle Gateway API:**
- Automated fund management
- Market treasury wallets
- Agent capital allocation
- Performance-based rebalancing
- Multi-currency support (USDC/EURC)
- Multi-signature support

**Features:**
- Each market has dedicated treasury
- Automated fund allocation
- Agent capital management
- Fee distribution
- Compliance reporting

### Embedded Wallets (Track 4)

**Circle Wallets API:**
- Autonomous agent wallets
- Institutional wallet creation
- Multi-currency support (USDC/EURC)
- CCTP integration for cross-chain
- Privacy-preserving options
- Multi-signature support

**Features:**
- Seamless wallet creation
- Agent autonomous operations
- Cross-chain wallet management
- Enterprise-grade security

---

## AI Agent System

### Agent Types

1. **Market Maker Agents**
   - Provide continuous liquidity
   - Update quotes in real-time
   - Manage spreads dynamically
   - Operate 24/7 autonomously

2. **Trading Agents**
   - Participate in markets based on predictions
   - Execute trades autonomously
   - Manage positions
   - Optimize returns

3. **Analyst Agents**
   - Analyze market conditions
   - Provide insights
   - Predict outcomes
   - Share sentiment

4. **Arbitrage Agents**
   - Find price discrepancies
   - Exploit arbitrage opportunities
   - Cross-market trading
   - Risk management

5. **Institutional Agents**
   - Represent institutional views
   - Custom strategies
   - Compliance-focused
   - Performance tracking

### Agent Architecture

**On-Chain Identity:**
- Each agent has on-chain address (Arc)
- Registered in AgentRegistry contract
- Reputation tracked on-chain
- Performance metrics stored on-chain

**Off-Chain Intelligence:**
- AI models run off-chain
- Execute transactions on-chain
- Real-time decision making
- Continuous learning

**Wallet Integration:**
- Agents use Circle Wallets
- Autonomous wallet operations
- Spending limits and controls
- Real-time monitoring

**Capital Management:**
- Capital allocated via Gateway
- Performance-based rebalancing
- Risk-based limits
- Multi-market optimization

### Agent Strategies

**1. Conservative Market Maker**
- Spread: 1-2% (wider, lower risk)
- Capital: 20% per market max
- Rebalancing: Every 5 minutes
- Risk: Max 30% position
- Currency: Prefers USDC

**2. Aggressive Market Maker**
- Spread: 0.3-0.8% (tighter, higher volume)
- Capital: 50% per market max
- Rebalancing: Every block (sub-second)
- Risk: Max 60% position
- Currency: Both USDC and EURC

**3. Adaptive Market Maker**
- Spread: Dynamic (AI-powered)
- Capital: AI-optimized
- Rebalancing: AI-determined
- Risk: AI-calculated
- Currency: Optimized mix

**4. Specialized Market Maker**
- Focus: Single market category
- Deep expertise in category
- Higher capital to specialty
- Better accuracy in specialty
- Currency: Based on market

### Agent-to-Agent Communication

**Communication Types:**
1. **Market Sentiment Sharing**
   - Share bullish/bearish sentiment
   - Confidence levels
   - Reasoning (public)

2. **Liquidity Coordination**
   - Coordinate liquidity provision
   - Prevent over-liquidity
   - Optimal distribution

3. **Risk Alerts**
   - Alert about market risks
   - Volatility spikes
   - Oracle concerns
   - Recommended actions

4. **Temporary Alliances**
   - Form alliances for large markets
   - Share capital and risk
   - Profit sharing
   - Time-limited

5. **Strategy Hints (Encrypted)**
   - Share encrypted strategy hints
   - Optimal spreads
   - Price targets
   - Timing information

**Implementation:**
- On-chain messaging (AgentMessaging contract)
- Direct agent-to-agent communication
- Broadcast messages
- Encrypted channels
- Cross-chain communication

### Agent Performance

**Metrics:**
- Total volume (USDC/EURC)
- Total fees earned
- Total PnL
- Sharpe ratio (risk-adjusted returns)
- Win rate
- Prediction accuracy
- Capital efficiency

**Tracking:**
- On-chain performance storage
- Real-time updates
- Historical data
- Leaderboards
- Category rankings

**Capital Allocation:**
- Performance-based allocation
- High performers get more capital
- Low performers get less capital
- Automatic replacement of poor performers

---

## Currency Strategy

### USDC (Primary)

**Characteristics:**
- Native gas token on Arc
- 6 decimal places
- Global acceptance
- Regulatory compliance
- Stable, predictable fees

**Usage:**
- Primary market currency
- Gas fees
- Default currency
- Global markets

### EURC (Secondary)

**Characteristics:**
- Euro-backed stablecoin
- 6 decimal places
- MiCA compliant
- European market access
- Automatic USDC conversion

**Usage:**
- European markets
- Euro-denominated markets
- Multi-currency support
- Cross-currency trading

### Multi-Currency Features

- Markets can accept both USDC and EURC
- Automatic conversion via Arc's FX engine
- Agent currency preferences
- Cross-currency liquidity
- Global market access

---

## Use Cases

### 1. Corporate Forecasting
- Revenue predictions
- Product launch success
- Market entry decisions
- Project completion

### 2. Climate & Environmental
- Carbon price forecasting
- Weather event predictions
- Renewable energy output
- Policy impact assessment

### 3. Supply Chain Risk
- Delivery predictions
- Supplier reliability
- Disruption forecasting
- Cost predictions

### 4. Financial Markets
- Economic indicators
- Market movements
- Policy impact
- Crisis prediction

### 5. Policy & Governance
- Policy outcomes
- Election predictions
- Regulatory impact
- Public sentiment

---

## Competitive Advantages

### vs. Polymarket
- ✅ Solves liquidity problem
- ✅ Institutional focus
- ✅ Better UX
- ✅ Built on Arc
- ✅ Multi-currency support

### vs. Kalshi
- ✅ Global access
- ✅ Lower fees
- ✅ More markets
- ✅ Faster innovation
- ✅ AI agent automation

### vs. Traditional Forecasting
- ✅ Collective intelligence
- ✅ Incentive alignment
- ✅ Real-time updates
- ✅ Transparent
- ✅ Automated

---

## Technical Stack

### Smart Contracts
- Solidity 0.8.20+
- Hardhat
- OpenZeppelin
- Arc network

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- React 18+
- Tailwind CSS
- Shadcn UI
- Wagmi + Viem
- TanStack Query

### APIs
- Circle Gateway API
- Circle Wallets API
- Circle Bridge Kit API
- CCTP API
- Arc RPC

### Agent System
- TypeScript
- Node.js
- WebSocket for real-time
- AI/ML models (optional)

---

## Key Implementation Details

### AMM for Binary Outcomes

**Formula:**
```
Constant product: x * y = k
Where:
  x = Yes shares
  y = No shares
  k = Constant

Price calculation:
  Yes price = y / (x + y)
  No price = x / (x + y)
```

**Features:**
- Dynamic fees based on liquidity
- Slippage protection
- Automatic price discovery
- Efficient capital utilization

### Agent Quote Generation

**Spread Calculation:**
```
spread = baseSpread + volatilityAdjustment - timeDecay - competitionAdjustment

Where:
  baseSpread = 0.5-2% (depending on market type)
  volatilityAdjustment = volatility * 0.5
  timeDecay = max(0, (timeToSettlement - 24h) / 24h) * 0.3
  competitionAdjustment = min(competition / 5, 0.5)

buyPrice = currentPrice - (spread / 2)
sellPrice = currentPrice + (spread / 2)
```

### Oracle Integration

**Multi-Oracle System:**
- Primary oracle (e.g., Chainlink)
- Backup oracles (2-3 additional)
- Consensus: "Settle if 3/5 oracles agree"
- Time-delayed settlement for disputes
- Transparent dispute resolution

---

## Development Workflow

### 1. Smart Contract Development
- Write contract in Solidity
- Compile with Hardhat
- Test locally
- Deploy to Arc testnet
- Verify on block explorer

### 2. Frontend Development
- Create components with Shadcn
- Integrate Wagmi for Web3
- Connect to contracts
- Integrate Circle APIs
- Test user flows

### 3. Agent System Development
- Implement agent service
- Connect to contracts
- Integrate Circle APIs
- Test agent operations
- Monitor performance

### 4. Integration Testing
- Test all tracks together
- Test cross-chain flows
- Test agent operations
- Test error handling
- Performance testing

---

## Important Notes

- All contracts deploy to Arc network
- Use USDC/EURC for all transactions
- Agent operations must be autonomous
- Support both USDC and EURC markets
- Integrate all 4 Circle tracks
- Optimize for Arc's sub-second finality
- Handle errors gracefully
- Provide user-friendly error messages
- Test thoroughly before deployment
- Document all code
- Follow best practices

---

## Resources

### Documentation
- Arc Network: https://docs.arc.network
- Circle Gateway: https://developers.circle.com/docs/gateway
- Circle Wallets: https://developers.circle.com/docs/wallets
- Circle Bridge Kit: https://developers.circle.com/docs/bridge-kit
- Wagmi: https://wagmi.sh
- Next.js: https://nextjs.org
- Shadcn: https://ui.shadcn.com

### Tools
- Hardhat: https://hardhat.org
- Viem: https://viem.sh
- TanStack Query: https://tanstack.com/query

---

**This context document provides comprehensive information about PredictFlow for AI assistants to understand the project fully.**

