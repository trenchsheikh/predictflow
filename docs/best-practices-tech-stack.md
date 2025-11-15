# PredictFlow: Best Practices & Tech Stack Guide

This document outlines the best practices and recommended tech stack for building PredictFlow, focusing on Next.js, React, Shadcn UI, and modern development practices.

---

## 🛠️ Tech Stack Overview

### Frontend Framework
- **Next.js 14+** (App Router)
  - Server components by default
  - Client components when needed
  - Built-in API routes
  - Optimized performance

### UI Framework
- **React 18+**
  - Server components
  - Client components with 'use client'
  - Hooks for state management
  - Concurrent features

### Styling
- **Tailwind CSS**
  - Utility-first CSS
  - Responsive design
  - Dark mode support
  - Custom configuration

### UI Components
- **Shadcn UI**
  - Accessible components
  - Customizable
  - Built on Radix UI
  - TypeScript support

### Web3 Integration
- **Wagmi**
  - React hooks for Ethereum
  - Type-safe
  - Easy wallet integration
  - Chain management

- **Viem**
  - TypeScript-first
  - Lightweight
  - Used by Wagmi
  - Arc network support

### Data Fetching
- **TanStack Query (React Query)**
  - Server state management
  - Caching
  - Background updates
  - Optimistic updates

### Type Safety
- **TypeScript**
  - Strict mode
  - Type-safe contracts
  - Better DX
  - Catch errors early

---

## 📁 Project Structure

```
predictflow-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── markets/
│   │   ├── page.tsx             # Markets list
│   │   ├── create/
│   │   │   └── page.tsx         # Create market
│   │   └── [id]/
│   │       └── page.tsx         # Market detail
│   ├── agents/
│   │   └── page.tsx             # Agent dashboard
│   └── api/                      # API routes
│       └── circle/
│           └── route.ts         # Circle API proxy
├── components/
│   ├── ui/                       # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── markets/
│   │   ├── MarketCard.tsx
│   │   ├── MarketList.tsx
│   │   ├── TradingInterface.tsx
│   │   └── MarketChart.tsx
│   ├── agents/
│   │   ├── AgentCard.tsx
│   │   ├── AgentDashboard.tsx
│   │   └── AgentPerformance.tsx
│   ├── wallet/
│   │   ├── WalletConnect.tsx
│   │   └── WalletBalance.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── wagmi.ts                 # Wagmi config
│   ├── contracts.ts             # Contract ABIs & addresses
│   ├── circle-api.ts            # Circle API client
│   ├── agent-service.ts         # Agent service
│   └── utils.ts                 # Utility functions
├── hooks/
│   ├── useMarket.ts             # Market hooks
│   ├── useAgent.ts              # Agent hooks
│   ├── useWallet.ts             # Wallet hooks
│   └── useCircle.ts             # Circle API hooks
├── types/
│   ├── market.ts                # Market types
│   ├── agent.ts                 # Agent types
│   └── circle.ts                # Circle API types
├── styles/
│   └── globals.css              # Global styles
├── public/                       # Static assets
├── .env.local                   # Environment variables
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json
```

---

## 🎨 Shadcn UI Setup

### Installation

```bash
# Initialize Shadcn
npx shadcn-ui@latest init

# Install components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add chart
```

### Configuration

```typescript
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Recommended Components

**Essential:**
- Button
- Card
- Input
- Select
- Dialog
- Table
- Badge
- Skeleton

**Advanced:**
- Chart (for market charts)
- Tabs (for market views)
- Dropdown Menu
- Toast (for notifications)
- Progress (for loading states)

---

## ⚛️ React Best Practices

### 1. Server vs Client Components

**Server Components (Default):**
```typescript
// app/markets/page.tsx
// No 'use client' - runs on server
export default async function MarketsPage() {
  const markets = await fetchMarkets() // Server-side fetch
  
  return (
    <div>
      {markets.map(market => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  )
}
```

**Client Components:**
```typescript
// components/TradingInterface.tsx
'use client' // Required for hooks and interactivity

import { useState } from 'react'
import { useWriteContract } from 'wagmi'

export function TradingInterface({ market }: { market: Market }) {
  const [amount, setAmount] = useState('')
  const { writeContract } = useWriteContract()
  
  // Client-side logic
}
```

### 2. State Management

**Local State (useState):**
```typescript
const [amount, setAmount] = useState('')
const [outcome, setOutcome] = useState<boolean>(true)
```

**Server State (TanStack Query):**
```typescript
import { useQuery } from '@tanstack/react-query'

function useMarket(marketId: string) {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: () => fetchMarket(marketId),
    staleTime: 1000, // 1 second (real-time data)
  })
}
```

**Global State (Context/Zustand):**
```typescript
// Only if needed across many components
import { create } from 'zustand'

interface AppState {
  selectedCurrency: 'USDC' | 'EURC'
  setCurrency: (currency: 'USDC' | 'EURC') => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedCurrency: 'USDC',
  setCurrency: (currency) => set({ selectedCurrency: currency }),
}))
```

### 3. Custom Hooks

**Market Hooks:**
```typescript
// hooks/useMarket.ts
import { useReadContract, useWriteContract } from 'wagmi'
import { PredictionMarket__factory } from '@/lib/contracts'

export function useMarket(marketAddress: string) {
  const { data: yesShares } = useReadContract({
    address: marketAddress,
    abi: PredictionMarket__factory.abi,
    functionName: 'yesShares',
  })
  
  const { data: noShares } = useReadContract({
    address: marketAddress,
    abi: PredictionMarket__factory.abi,
    functionName: 'noShares',
  })
  
  const yesPrice = yesShares && noShares 
    ? (Number(yesShares) / (Number(yesShares) + Number(noShares))) * 100
    : 50
  
  const noPrice = 100 - yesPrice
  
  return { yesPrice, noPrice, yesShares, noShares }
}
```

**Agent Hooks:**
```typescript
// hooks/useAgent.ts
import { useQuery } from '@tanstack/react-query'

export function useAgent(agentId: string) {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => fetchAgent(agentId),
    refetchInterval: 5000, // Refetch every 5 seconds
  })
}
```

### 4. Error Handling

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>
    }
    
    return this.props.children
  }
}
```

### 5. Loading States

```typescript
// Using Skeleton from Shadcn
import { Skeleton } from '@/components/ui/skeleton'

export function MarketCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-2" />
      </CardHeader>
      <div className="p-4">
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  )
}
```

---

## 🔗 Wagmi Integration

### Configuration

```typescript
// lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { arc } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [arc],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! }),
  ],
  transports: {
    [arc.id]: http(process.env.NEXT_PUBLIC_ARC_RPC_URL),
  },
})
```

### Provider Setup

```typescript
// app/providers.tsx
'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Usage Examples

```typescript
// Connect wallet
import { useConnect } from 'wagmi'

function ConnectButton() {
  const { connect, connectors } = useConnect()
  
  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </Button>
  )
}

// Read contract
import { useReadContract } from 'wagmi'

function MarketPrice({ marketAddress }: { marketAddress: string }) {
  const { data: price } = useReadContract({
    address: marketAddress,
    abi: PredictionMarket__factory.abi,
    functionName: 'getPrice',
    args: [true], // Yes outcome
  })
  
  return <div>Price: {price?.toString()}</div>
}

// Write contract
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function TradeButton({ marketAddress }: { marketAddress: string }) {
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading } = useWaitForTransactionReceipt({ hash })
  
  const handleTrade = () => {
    writeContract({
      address: marketAddress,
      abi: PredictionMarket__factory.abi,
      functionName: 'buyShares',
      args: [true, parseUnits('100', 6)], // Yes, 100 USDC
    })
  }
  
  return (
    <Button onClick={handleTrade} disabled={isLoading}>
      {isLoading ? 'Trading...' : 'Trade'}
    </Button>
  )
}
```

---

## 🎯 Next.js Best Practices

### 1. App Router Structure

```typescript
// app/layout.tsx (Root layout)
import { Providers } from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### 2. Server Actions

```typescript
// app/actions/market.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createMarket(formData: FormData) {
  // Server-side market creation
  const question = formData.get('question') as string
  
  // Create market via contract or API
  // ...
  
  revalidatePath('/markets')
}
```

### 3. API Routes

```typescript
// app/api/circle/wallet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { CircleGateway } from '@/lib/circle-api'

export async function POST(request: NextRequest) {
  const { currency } = await request.json()
  
  const gateway = new CircleGateway()
  const walletId = await gateway.createWallet(currency)
  
  return NextResponse.json({ walletId })
}
```

### 4. Metadata

```typescript
// app/markets/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const market = await fetchMarket(params.id)
  
  return {
    title: market.question,
    description: `PredictFlow market: ${market.question}`,
  }
}
```

---

## 🎨 Styling Best Practices

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... Shadcn colors
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### CSS Variables

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... Shadcn variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... Dark mode variables */
  }
}
```

---

## 📦 Package Recommendations

### Essential Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

---

## ✅ Best Practices Checklist

### Code Quality
- [ ] Use TypeScript strict mode
- [ ] Follow ESLint rules
- [ ] Format with Prettier
- [ ] Write meaningful comments
- [ ] Use descriptive variable names

### Performance
- [ ] Use server components when possible
- [ ] Implement proper loading states
- [ ] Optimize images
- [ ] Use React.memo for expensive components
- [ ] Implement code splitting

### User Experience
- [ ] Handle errors gracefully
- [ ] Show loading states
- [ ] Provide feedback for actions
- [ ] Optimistic updates
- [ ] Responsive design

### Security
- [ ] Never expose private keys
- [ ] Validate user input
- [ ] Use environment variables
- [ ] Sanitize data
- [ ] Implement rate limiting

---

## 🚀 Quick Start Commands

```bash
# Create Next.js app
npx create-next-app@latest predictflow-frontend --typescript --tailwind --app

# Install dependencies
cd predictflow-frontend
npm install wagmi viem @tanstack/react-query

# Setup Shadcn
npx shadcn-ui@latest init

# Install Shadcn components
npx shadcn-ui@latest add button card input select dialog table

# Run development server
npm run dev
```

---

**Follow these best practices to build a high-quality, maintainable PredictFlow frontend!**

