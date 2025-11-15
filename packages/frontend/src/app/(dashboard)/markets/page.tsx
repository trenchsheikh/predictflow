'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, TrendingUp, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Market {
  id: string
  question: string
  slug: string
  outcomes: Array<{
    id: string
    title: string
    price: number
  }>
  volume: number
  liquidity: number
  endDate: string
}

export default function MarketsPage() {
  const [search, setSearch] = useState('')

  const { data: markets = [], isLoading } = useQuery<Market[]>({
    queryKey: ['markets', search],
    queryFn: async () => {
      const response = await fetch(
        `/api/polymarket/markets${search ? `?search=${encodeURIComponent(search)}` : ''}`
      )
      if (!response.ok) throw new Error('Failed to fetch markets')
      return response.json()
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">
            Browse and mirror markets from Polymarket to Arc
          </p>
        </div>
        <Button>
          <TrendingUp className="h-4 w-4 mr-2" />
          Mirror Market
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Markets</CardTitle>
          <CardDescription>Find markets to mirror and trade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets by question..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Markets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Markets</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${markets.length} markets available`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market</TableHead>
                  <TableHead>Yes Price</TableHead>
                  <TableHead>No Price</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Liquidity</TableHead>
                  <TableHead>Ends</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading markets...
                    </TableCell>
                  </TableRow>
                ) : markets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No markets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  markets.map((market) => {
                    const yesOutcome = market.outcomes?.find((o) => o.title === 'Yes')
                    const noOutcome = market.outcomes?.find((o) => o.title === 'No')

                    return (
                      <TableRow key={market.id}>
                        <TableCell className="font-medium max-w-md">
                          <div className="flex flex-col">
                            <span className="line-clamp-2">{market.question}</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              ID: {market.id.slice(0, 8)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            {yesOutcome ? (yesOutcome.price * 100).toFixed(1) : 'N/A'}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-red-600 font-medium">
                            {noOutcome ? (noOutcome.price * 100).toFixed(1) : 'N/A'}%
                          </span>
                        </TableCell>
                        <TableCell>
                          ${market.volume ? (market.volume / 1000000).toFixed(2) : '0'}M
                        </TableCell>
                        <TableCell>
                          ${market.liquidity ? (market.liquidity / 1000).toFixed(0) : '0'}K
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {market.endDate
                              ? formatDistanceToNow(new Date(parseInt(market.endDate) * 1000), {
                                  addSuffix: true,
                                })
                              : 'Unknown'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Not Mirrored</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Mirror</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

