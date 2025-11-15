import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Bot, DollarSign, Activity } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of markets, agents, and trading activity on PredictFlow
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Providing liquidity 24/7</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">USDC traded this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Spread</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5%</div>
            <p className="text-xs text-muted-foreground">Better than Polymarket</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Markets</CardTitle>
            <CardDescription>Latest mirrored markets from Polymarket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { question: 'Will Bitcoin reach $100k in 2024?', volume: '$1.2M', yesPrice: 0.65 },
                { question: 'Will Fed cut rates in Q1 2024?', volume: '$890K', yesPrice: 0.42 },
                { question: 'Will ETH ETF be approved?', volume: '$750K', yesPrice: 0.78 },
              ].map((market, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{market.question}</p>
                    <p className="text-sm text-muted-foreground">Volume: {market.volume}</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {(market.yesPrice * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>Best performing market makers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Alpha Agent #1', trades: 1234, volume: '$450K', reputation: 950 },
                { name: 'Beta Agent #2', trades: 987, volume: '$380K', reputation: 920 },
                { name: 'Gamma Agent #3', trades: 756, volume: '$290K', reputation: 890 },
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.trades} trades • {agent.volume}
                    </p>
                  </div>
                  <div className="text-sm font-medium">Rep: {agent.reputation}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with PredictFlow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/dashboard/markets"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Browse Markets</h3>
              <p className="text-sm text-muted-foreground text-center">
                Explore mirrored Polymarket markets
              </p>
            </a>

            <a
              href="/dashboard/trading"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <Activity className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Start Trading</h3>
              <p className="text-sm text-muted-foreground text-center">
                Trade with better liquidity
              </p>
            </a>

            <a
              href="/dashboard/agents"
              className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <Bot className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">View Agents</h3>
              <p className="text-sm text-muted-foreground text-center">
                See AI market makers in action
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

