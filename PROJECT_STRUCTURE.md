# PredictFlow Project Structure

## 📁 Directory Structure

```
predictflow/
├── packages/                    # Monorepo packages
│   ├── contracts/              # Smart contracts package
│   │   ├── contracts/
│   │   │   ├── core/           # Core contracts
│   │   │   │   ├── MarketFactory.sol
│   │   │   │   └── MarketMirror.sol
│   │   │   ├── agents/         # Agent contracts
│   │   │   └── settlement/     # Settlement contracts
│   │   ├── scripts/            # Deployment scripts
│   │   │   └── deploy.ts
│   │   ├── test/               # Contract tests
│   │   │   └── MarketFactory.test.ts
│   │   ├── hardhat.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── frontend/               # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # Next.js app router
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities and configs
│   │   │   └── hooks/         # Custom hooks
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared code
│       ├── src/
│       │   ├── types/         # TypeScript types
│       │   │   └── market.ts
│       │   └── utils/         # Utility functions
│       │       ├── formatting.ts
│       │       └── validation.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── predictflow-project.md
│   ├── implementation-hackathon.md
│   ├── claude-context.md
│   ├── claude-code-prompt.md
│   ├── best-practices-tech-stack.md
│   └── README.md
│
├── scripts/                     # Utility scripts
├── tests/                       # Integration tests
│
├── .gitignore
├── .prettierrc
├── .prettierignore
├── .eslintrc.json
├── package.json                 # Root package.json (Turborepo)
├── turbo.json                   # Turborepo config
├── tsconfig.json                # Root TypeScript config
├── README.md
├── ARCHITECTURE.md
└── PROJECT_STRUCTURE.md         # This file
```

## 🏗️ Engineering Principles Applied

### 1. **Monorepo Architecture**
- ✅ Turborepo for build orchestration
- ✅ Workspace packages for code sharing
- ✅ Shared types and utilities

### 2. **Type Safety**
- ✅ TypeScript throughout
- ✅ Zod schemas for runtime validation
- ✅ Type generation from contracts

### 3. **Code Quality**
- ✅ ESLint configuration
- ✅ Prettier for formatting
- ✅ Strict TypeScript settings
- ✅ Consistent code style

### 4. **Project Organization**
- ✅ Clear separation of concerns
- ✅ Feature-based structure
- ✅ Reusable shared code
- ✅ Proper documentation

### 5. **Development Experience**
- ✅ Hot reload for all packages
- ✅ Type checking across packages
- ✅ Unified build system
- ✅ Clear scripts and commands

## 📦 Package Details

### `@predictflow/contracts`
Smart contracts for Arc blockchain:
- MarketFactory - Creates markets
- MarketMirror - Mirrors Polymarket markets
- Hardhat for development and testing
- TypeChain for TypeScript types

### `@predictflow/frontend`
Next.js 15 application:
- App Router architecture
- Shadcn UI components
- Circle Wallets + Wagmi integration
- Polymarket integration

### `@predictflow/shared`
Shared code across packages:
- TypeScript types
- Zod validation schemas
- Utility functions
- Formatting helpers

## 🚀 Next Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your keys
   ```

3. **Start Development**
   ```bash
   pnpm dev
   ```

4. **Build Contracts**
   ```bash
   cd packages/contracts
   pnpm compile
   ```

5. **Run Tests**
   ```bash
   pnpm test
   ```

## 📝 Documentation

All documentation is in the `docs/` folder:
- **Project Overview**: `docs/predictflow-project.md`
- **Implementation Guide**: `docs/implementation-hackathon.md`
- **Architecture**: `ARCHITECTURE.md`
- **This File**: `PROJECT_STRUCTURE.md`

