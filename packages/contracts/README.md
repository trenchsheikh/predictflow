# PredictFlow Smart Contracts

Smart contracts for PredictFlow prediction market platform on Arc blockchain.

## Structure

```
contracts/
├── core/
│   ├── MarketFactory.sol      # Market creation
│   ├── MarketMirror.sol       # Polymarket mirroring
│   └── PredictionMarket.sol   # AMM for binary outcomes
├── agents/
│   ├── AgentRegistry.sol      # Agent management
│   └── AgentMarketMaker.sol   # Agent liquidity provision
└── settlement/
    └── SettlementContract.sol # Market settlement
```

## Development

```bash
# Compile contracts
pnpm compile

# Run tests
pnpm test

# Deploy to Arc
pnpm deploy:arc

# Generate TypeScript types
pnpm typechain
```

## Contracts

### MarketFactory
Creates new prediction markets on Arc.

### MarketMirror
Mirrors markets from Polymarket to Arc.

### PredictionMarket
Automated market maker for binary prediction markets.

### AgentRegistry
Manages AI agent registration and reputation.

### SettlementContract
Handles market outcome determination and fund distribution.

