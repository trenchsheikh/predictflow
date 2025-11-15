# PredictFlow Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git installed

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
cd c:\encode-idea
npm install

# Install contracts dependencies
cd packages\contracts
npm install

# Install frontend dependencies (in background - takes 2-3 minutes)
cd packages\frontend
npm install --legacy-peer-deps
```

### 2. Environment Configuration

```bash
# Copy example env file
cd packages\frontend
copy .env.example .env.local

# Edit .env.local with your keys
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_ARC_RPC_URL=<your_arc_rpc>
NEXT_PUBLIC_ARC_CHAIN_ID=<arc_chain_id>
CIRCLE_API_KEY=<your_circle_api_key>
NEXT_PUBLIC_CIRCLE_APP_ID=<your_circle_app_id>
```

### 3. Compile Contracts

```bash
cd packages\contracts
npx hardhat compile
```

### 4. Run Tests

```bash
cd packages\contracts
npx hardhat test
```

### 5. Deploy Contracts (Arc Testnet)

```bash
cd packages\contracts
npx hardhat run scripts\deploy.ts --network arc
```

### 6. Start Frontend

```bash
cd packages\frontend
npm run dev
```

Access at: http://localhost:3000

## Project Structure

```
predictflow/
├── packages/
│   ├── contracts/              # Smart contracts
│   │   ├── contracts/
│   │   │   ├── core/          # Core contracts
│   │   │   ├── agents/        # Agent contracts
│   │   │   ├── settlement/    # Settlement
│   │   │   └── mocks/         # Test mocks
│   │   ├── scripts/           # Deployment
│   │   └── test/              # Tests
│   │
│   ├── frontend/              # Next.js app
│   │   ├── src/
│   │   │   ├── app/          # Pages
│   │   │   ├── components/   # UI components
│   │   │   └── lib/          # Services
│   │   └── package.json
│   │
│   └── shared/                # Shared code
│       └── src/types/
│
└── docs/                      # Documentation
```

## Development Workflow

### Adding a New Contract

1. Create contract in `packages/contracts/contracts/`
2. Write tests in `packages/contracts/test/`
3. Compile: `npx hardhat compile`
4. Test: `npx hardhat test`
5. Deploy: `npx hardhat run scripts/deploy.ts`

### Adding a Frontend Feature

1. Create components in `src/components/`
2. Create pages in `src/app/`
3. Add API routes in `src/app/api/`
4. Test locally: `npm run dev`

## Common Issues

### Issue: npm install fails with dependency conflicts

**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: Hardhat compile fails

**Solution:**
```bash
# Clean cache
npx hardhat clean

# Reinstall
rm -rf node_modules
npm install

# Compile again
npx hardhat compile
```

### Issue: Frontend won't start

**Solution:**
1. Check Node.js version: `node --version` (should be 18+)
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Issue: Contract deployment fails

**Solution:**
- Check RPC URL is correct
- Verify private key has funds
- Check gas settings in hardhat.config.ts

## Testing

### Run All Contract Tests
```bash
cd packages/contracts
npx hardhat test
```

### Run Specific Test
```bash
npx hardhat test test/PredictionMarket.test.ts
```

### Test Coverage
```bash
npx hardhat coverage
```

## Deployment

### Deploy to Arc Testnet

1. Set up environment:
   ```bash
   # In packages/contracts/.env
   ARC_RPC_URL=<rpc_url>
   PRIVATE_KEY=<your_private_key>
   USDC_ADDRESS=<usdc_contract>
   EURC_ADDRESS=<eurc_contract>
   ```

2. Deploy:
   ```bash
   npx hardhat run scripts/deploy.ts --network arc
   ```

3. Save contract addresses to frontend `.env.local`

### Deploy Frontend

```bash
cd packages/frontend

# Build
npm run build

# Deploy to Vercel
vercel deploy
```

## Available Scripts

### Root Level
- `npm run dev` - Start all packages in dev mode
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages

### Contracts
- `npm run compile` - Compile contracts
- `npm test` - Run tests
- `npm run deploy:arc` - Deploy to Arc

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code

## Documentation

- **Implementation Guide**: `docs/implementation-hackathon.md`
- **Architecture**: `ARCHITECTURE.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **Implementation Status**: `IMPLEMENTATION_STATUS.md`

## Getting Help

- Check documentation in `docs/` folder
- Review test files for usage examples
- See implementation guide for detailed workflows

## Next Steps

1. ✅ Setup complete
2. ⬜ Deploy contracts to Arc testnet
3. ⬜ Configure frontend with contract addresses
4. ⬜ Test market mirroring
5. ⬜ Test trading flow
6. ⬜ Deploy to production

