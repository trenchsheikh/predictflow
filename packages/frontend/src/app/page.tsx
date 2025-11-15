import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">PredictFlow</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Institutional Prediction Markets with AI Agent Market Making
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Launch App</Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Mirror Markets</CardTitle>
              <CardDescription>
                Mirror top markets from Polymarket to Arc blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access thousands of existing markets instantly with better execution and lower
                fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Liquidity</CardTitle>
              <CardDescription>AI agents provide deep liquidity 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Autonomous agents ensure tight spreads and instant execution for all market sizes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Arc Network</CardTitle>
              <CardDescription>Sub-second finality, USDC gas fees</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built on Arc for institutional-grade performance with Circle integration
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold mb-2">✅ Market Mirroring</h3>
              <p className="text-sm text-muted-foreground">
                Instantly mirror top Polymarket markets to Arc
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✅ AI Market Making</h3>
              <p className="text-sm text-muted-foreground">
                Autonomous agents provide continuous liquidity
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✅ Cross-Chain Bridge</h3>
              <p className="text-sm text-muted-foreground">
                Bridge USDC from any chain via Circle CCTP
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✅ Embedded Wallets</h3>
              <p className="text-sm text-muted-foreground">Web2-friendly login with email/username</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

