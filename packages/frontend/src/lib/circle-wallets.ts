import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

export const circleSDK = new W3SSdk({
  appSettings: {
    appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID || '',
  },
})

export class CircleWalletService {
  private sdk: W3SSdk
  private userToken: string | null = null
  private encryptionKey: string | null = null

  constructor() {
    this.sdk = circleSDK
  }

  setAuthentication(userToken: string, encryptionKey: string) {
    this.userToken = userToken
    this.encryptionKey = encryptionKey
    this.sdk.setAuthentication({
      userToken,
      encryptionKey,
    })
  }

  async executeChallenge(challengeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sdk.execute(challengeId, (error, result) => {
        if (error) {
          console.error(`Challenge error: ${error?.code}: ${error?.message}`)
          reject(error)
          return
        }
        console.log(`Challenge: ${result?.type}, status: ${result?.status}`)
        resolve(result)
      })
    })
  }
}

export async function createUserWallet(userId: string, email: string) {
  const response = await fetch('/api/circle/create-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email }),
  })
  return response.json()
}

export async function getUserWallet(userId: string) {
  const response = await fetch(`/api/circle/wallet/${userId}`)
  return response.json()
}

