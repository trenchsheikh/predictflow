import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client'

const POLYMARKET_SUBGRAPH =
  process.env.POLYMARKET_SUBGRAPH_URL ||
  'https://api.thegraph.com/subgraphs/name/polymarket/polymarket'

export interface PolymarketMarket {
  id: string
  question: string
  slug: string
  endDate: string
  outcomes: Array<{
    id: string
    title: string
    price: number
    volume: number
  }>
  volume: number
  liquidity: number
  image: string
  description: string
  conditionId: string
}

export class PolymarketIntegration {
  private client: ApolloClient<any>

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({
        uri: POLYMARKET_SUBGRAPH,
      }),
      cache: new InMemoryCache(),
    })
  }

  async fetchActiveMarkets(limit: number = 50): Promise<PolymarketMarket[]> {
    const query = gql`
      query GetMarkets($first: Int!) {
        markets(
          where: { active: true, closed: false }
          orderBy: volume
          orderDirection: desc
          first: $first
        ) {
          id
          question
          slug
          endDate
          outcomes {
            id
            title
            price
          }
          volume
          liquidity
          image
          description
          conditionId
        }
      }
    `

    try {
      const result = await this.client.query({
        query,
        variables: { first: limit },
      })

      return result.data.markets as PolymarketMarket[]
    } catch (error) {
      console.error('Failed to fetch Polymarket markets:', error)
      return []
    }
  }

  async getMarketDetails(marketId: string): Promise<PolymarketMarket | null> {
    const query = gql`
      query GetMarket($id: ID!) {
        market(id: $id) {
          id
          question
          slug
          endDate
          outcomes {
            id
            title
            price
            volume
          }
          volume
          liquidity
          image
          description
          conditionId
        }
      }
    `

    try {
      const result = await this.client.query({
        query,
        variables: { id: marketId },
      })

      return result.data.market as PolymarketMarket
    } catch (error) {
      console.error('Failed to fetch Polymarket market details:', error)
      return null
    }
  }

  /**
   * Search markets by query
   */
  async searchMarkets(searchQuery: string, limit: number = 20): Promise<PolymarketMarket[]> {
    const query = gql`
      query SearchMarkets($first: Int!) {
        markets(
          where: { active: true, closed: false }
          orderBy: volume
          orderDirection: desc
          first: $first
        ) {
          id
          question
          slug
          endDate
          outcomes {
            id
            title
            price
          }
          volume
          liquidity
          image
          description
          conditionId
        }
      }
    `

    try {
      const result = await this.client.query({
        query,
        variables: { first: limit },
      })

      const markets = result.data.markets as PolymarketMarket[]

      // Client-side filtering by search query
      if (searchQuery) {
        return markets.filter((market) =>
          market.question.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return markets
    } catch (error) {
      console.error('Failed to search Polymarket markets:', error)
      return []
    }
  }
}

