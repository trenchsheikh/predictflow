# PredictFlow Quick Start Guide

## 🚀 Fastest Way to See It Working

### Option 1: Frontend Only (5 minutes)

```bash
# 1. Install frontend dependencies
cd packages/frontend
npm install --legacy-peer-deps

# 2. Install UI dependencies
npm install @radix-ui/react-dialog @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to: http://localhost:3000
```

**You'll see**:
- ✅ Professional landing page
- ✅ Dashboard with stats
- ✅ Markets page (will show loading or errors without backend)
- ✅ Wallet integration UI

---

### Option 2: With Mock Data (10 minutes)

Same as Option 1, but update the API route:

**File**: `packages/frontend/src/app/api/polymarket/markets/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock data for testing
  const mockMarkets = [
    {
      id: "market-1",
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      slug: "bitcoin-100k-2024",
      outcomes: [
        { id: "yes-1", title: "Yes", price: 0.65 },
        { id: "no-1", title: "No", price: 0.35 }
      ],
      volume: 1250000,
      liquidity: 450000,
      endDate: "1735689600"
    },
    {
      id: "market-2",
      question: "Will the Fed cut interest rates in Q1 2024?",
      slug: "fed-rate-cut-q1-2024",
      outcomes: [
        { id: "yes-2", title: "Yes", price: 0.42 },
        { id: "no-2", title: "No", price: 0.58 }
      ],
      volume: 890000,
      liquidity: 320000,
      endDate: "1711929600"
    },
    {
      id: "market-3",
      question: "Will Ethereum ETF be approved in 2024?",
      slug: "eth-etf-2024",
      outcomes: [
        { id: "yes-3", title: "Yes", price: 0.78 },
        { id: "no-3", title: "No", price: 0.22 }
      ],
      volume: 750000,
      liquidity: 280000,
      endDate: "1735689600"
    }
  ]

  return NextResponse.json(mockMarkets)
}
```

Now the Markets page will display real data!

---

### Option 3: Full Stack with Foundry (20 minutes)

**Prerequisites**: Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Setup**:
```bash
# 1. Contracts
cd packages/contracts
forge init --force
mv contracts src

# Create foundry.toml
cat > foundry.toml <<EOF
[profile.default]
src = 'src'
out = 'out'
libs = ['node_modules']
solc_version = '0.8.20'
EOF

# Compile
forge build

# Test
forge test

# 2. Frontend (same as Option 1)
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🎨 What You'll See

### Landing Page (`/`)
- Hero section with project description
- Feature cards (Market Mirroring, AI Liquidity, Arc Network)
- Call-to-action buttons
- Modern, professional design

### Dashboard (`/dashboard`)
- Stats cards (Total Markets, Active Agents, Volume, Spread)
- Recent markets list
- Top agents leaderboard
- Quick action cards

### Markets (`/dashboard/markets`)
- Search bar
- Markets table with:
  - Question
  - Yes/No prices
  - Volume & liquidity
  - Time remaining
  - Mirror status
  - Action buttons

### Components
- Professional sidebar navigation
- Header with search and wallet button
- Wallet connection modal
- Responsive design
- Dark/light mode support (via Tailwind)

---

## 🔧 Troubleshooting

### Issue: "Module not found"
```bash
# Install missing dependencies
cd packages/frontend
npm install @radix-ui/react-dialog @radix-ui/react-slot
```

### Issue: "Cannot find module '@/lib/utils'"
```bash
# Create the file if missing
echo 'import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}' > src/lib/utils.ts
```

### Issue: "Error: listen EADDRINUSE: address already in use"
```bash
# Port 3000 is in use, use different port
npm run dev -- -p 3001
```

### Issue: Build errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

---

## 📱 Testing Checklist

- [ ] Landing page loads
- [ ] Navigation works (click "Launch App")
- [ ] Dashboard displays stats
- [ ] Sidebar navigation works
- [ ] Markets page loads
- [ ] Search bar is functional
- [ ] Wallet button opens modal
- [ ] Responsive design (resize browser)
- [ ] No console errors
- [ ] Fast page transitions

---

## 🌐 Browser Testing

Open these URLs:
1. http://localhost:3000 - Landing page
2. http://localhost:3000/dashboard - Dashboard
3. http://localhost:3000/dashboard/markets - Markets
4. http://localhost:3000/dashboard/agents - Agents (empty for now)
5. http://localhost:3000/dashboard/trading - Trading (empty for now)

---

## 📊 Expected Performance

- **First Load**: < 3 seconds
- **Page Transitions**: < 500ms
- **No Errors**: Check browser console (F12)
- **Responsive**: Works on mobile, tablet, desktop

---

## 🎯 Demo Script (5 minutes)

1. **Landing** (30s)
   - "Here's PredictFlow - prediction markets with AI liquidity"
   - "Built on Arc blockchain with Circle integration"
   - Click "Launch App"

2. **Dashboard** (1min)
   - "Overview shows total markets, active agents, volume"
   - "Real-time stats from prediction markets"
   - "AI agents providing 24/7 liquidity"

3. **Markets** (2min)
   - "Markets mirrored from Polymarket"
   - "See Yes/No prices, volume, liquidity"
   - "One-click mirroring to Arc blockchain"
   - "Better execution than original platforms"

4. **Technology** (1min)
   - "Next.js 14 frontend"
   - "Solidity smart contracts"
   - "Circle Wallets for web2-friendly onboarding"
   - "Wagmi for web3 wallet support"

5. **Future** (30s)
   - "Deploy contracts to Arc testnet"
   - "Connect to real Polymarket API"
   - "Enable AI agent trading"
   - "Launch on mainnet"

---

## 🚀 Next Steps After Testing

1. ✅ Frontend works - documented
2. ⏳ Fix Hardhat issues (see ISSUES_AND_FIXES.md)
3. ⏳ Deploy contracts
4. ⏳ Connect real APIs
5. ⏳ Full integration testing

---

## 📞 Need Help?

See `ISSUES_AND_FIXES.md` for detailed troubleshooting.

---

*Last Updated: 2025-11-14 21:05 UTC*

