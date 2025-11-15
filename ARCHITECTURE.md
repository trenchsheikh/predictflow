# PredictFlow Architecture

## System Overview

PredictFlow is a monorepo built with modern engineering principles:

```
predictflow/
├── packages/
│   ├── contracts/     # Smart contracts (Hardhat)
│   ├── frontend/       # Next.js application
│   └── shared/         # Shared types and utilities
├── docs/               # Documentation
├── scripts/            # Deployment scripts
└── tests/              # Integration tests
```

## Engineering Principles

### 1. Monorepo Structure
- **Turborepo** for build orchestration
- **Workspace packages** for code sharing
- **Shared types** via `@predictflow/shared`

### 2. Type Safety
- **TypeScript** throughout
- **Zod schemas** for runtime validation
- **Type generation** from contracts (TypeChain)

### 3. Code Quality
- **ESLint** for linting
- **Prettier** for formatting
- **Strict TypeScript** configuration
- **Pre-commit hooks** (recommended)

### 4. Testing Strategy
- **Unit tests** for contracts (Hardhat)
- **Integration tests** for full flows
- **E2E tests** for critical paths

### 5. Security
- **OpenZeppelin** contracts
- **Input validation** at all layers
- **Access control** in smart contracts
- **Environment variable** management

## Package Details

### Contracts Package
- **Framework**: Hardhat
- **Language**: Solidity 0.8.20
- **Testing**: Chai + Hardhat
- **Type Generation**: TypeChain

### Frontend Package
- **Framework**: Next.js 15
- **UI**: Shadcn UI + Tailwind
- **State**: Zustand + React Query
- **Web3**: Wagmi + Circle SDK

### Shared Package
- **Types**: TypeScript interfaces
- **Validation**: Zod schemas
- **Utils**: Formatting, validation helpers

## Development Workflow

1. **Local Development**
   ```bash
   pnpm dev  # Start all packages
   ```

2. **Building**
   ```bash
   pnpm build  # Build all packages
   ```

3. **Testing**
   ```bash
   pnpm test  # Run all tests
   ```

4. **Deployment**
   ```bash
   pnpm deploy:arc  # Deploy contracts
   ```

## Best Practices

### Smart Contracts
- Use OpenZeppelin contracts
- Implement access control
- Add events for all state changes
- Write comprehensive tests

### Frontend
- Use server components by default
- Client components only when needed
- Proper error boundaries
- Loading states for async operations

### Shared Code
- Keep types in sync
- Validate at boundaries
- Document public APIs

