'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CircleWalletService } from '@/lib/circle-wallets'
import { Wallet, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type WalletType = 'circle' | 'external' | null

export function WalletButton() {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [circleWallet, setCircleWallet] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType')
    if (savedWalletType === 'circle') {
      loadCircleWallet()
    } else if (savedWalletType === 'external' && !isConnected) {
      setWalletType(null)
      localStorage.removeItem('walletType')
    }
  }, [isConnected])

  async function loadCircleWallet() {
    const userId = localStorage.getItem('userId')
    const userToken = localStorage.getItem('userToken')

    if (!userId || !userToken) return

    try {
      const wallet = { id: userId }
      setCircleWallet(wallet)
      setWalletType('circle')
    } catch (error) {
      console.error('Failed to load Circle wallet:', error)
    }
  }

  function handleExternalWalletConnect(connector: any) {
    connect({ connector })
    setWalletType('external')
    localStorage.setItem('walletType', 'external')
    setIsOpen(false)
  }

  function handleDisconnect() {
    if (walletType === 'circle') {
      setCircleWallet(null)
      setWalletType(null)
      localStorage.removeItem('walletType')
      localStorage.removeItem('userId')
      localStorage.removeItem('userToken')
      localStorage.removeItem('encryptionKey')
    } else {
      disconnect()
      setWalletType(null)
      localStorage.removeItem('walletType')
    }
  }

  if (walletType === 'circle' && circleWallet) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          Circle Wallet
        </Badge>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  if (walletType === 'external' && isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">
          <div className="font-medium">
            {balance?.formatted ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}{' '}
            {balance?.symbol || 'USDC'}
          </div>
          <div className="text-xs text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose how you want to connect to PredictFlow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Web3 Wallets</h3>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="outline"
                  onClick={() => handleExternalWalletConnect(connector)}
                  className="w-full justify-start"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {connector.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Email/Username</h3>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/auth/signup')}
              className="w-full justify-start"
            >
              <Mail className="h-4 w-4 mr-2" />
              Sign up with Email
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              No crypto knowledge needed. We'll create a wallet for you!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

