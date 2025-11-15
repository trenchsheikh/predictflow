/**
 * Validate Ethereum/Arc address (basic format check)
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate market question
 */
export function isValidMarketQuestion(question: string): boolean {
  return question.length >= 10 && question.length <= 200
}

