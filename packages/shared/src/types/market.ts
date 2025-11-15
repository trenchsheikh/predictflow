import { z } from 'zod'

export const MarketSchema = z.object({
  id: z.string(),
  question: z.string(),
  endDate: z.number(),
  yesPrice: z.number().min(0).max(1),
  noPrice: z.number().min(0).max(1),
  volume: z.number(),
  liquidity: z.number(),
  isMirrored: z.boolean(),
  predictFlowMarketId: z.number().optional(),
  polymarketId: z.string().optional(),
})

export type Market = z.infer<typeof MarketSchema>

export const AgentSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  capital: z.number(),
  reputation: z.number(),
  verified: z.boolean(),
})

export type Agent = z.infer<typeof AgentSchema>

