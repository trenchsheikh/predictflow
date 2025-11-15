import { NextRequest, NextResponse } from 'next/server'
import { PolymarketIntegration } from '@/lib/polymarket-integration'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '50')

    const polymarket = new PolymarketIntegration()

    let markets
    if (search) {
      markets = await polymarket.searchMarkets(search, limit)
    } else {
      markets = await polymarket.fetchActiveMarkets(limit)
    }

    return NextResponse.json(markets)
  } catch (error) {
    console.error('Failed to fetch markets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    )
  }
}

