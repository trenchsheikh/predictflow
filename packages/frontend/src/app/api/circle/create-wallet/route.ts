import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'userId and email are required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.circle.com/v1/w3s/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Circle API error:', error)
      return NextResponse.json(
        { error: 'Failed to create wallet' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      userToken: data.data.userToken,
      encryptionKey: data.data.encryptionKey,
      walletId: data.data.walletId,
    })
  } catch (error) {
    console.error('Failed to create wallet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

