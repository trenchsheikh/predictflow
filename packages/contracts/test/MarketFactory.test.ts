import { expect } from 'chai'
import { ethers } from 'hardhat'
import { MarketFactory } from '../typechain-types'

describe('MarketFactory', function () {
  let marketFactory: MarketFactory
  let usdc: string
  let eurc: string
  let owner: any

  beforeEach(async function () {
    ;[owner] = await ethers.getSigners()
    
    // Mock token addresses for testing
    usdc = ethers.Wallet.createRandom().address
    eurc = ethers.Wallet.createRandom().address
    
    const MarketFactoryFactory = await ethers.getContractFactory('MarketFactory')
    marketFactory = await MarketFactoryFactory.deploy(usdc, eurc)
    await marketFactory.waitForDeployment()
  })

  it('Should deploy with correct token addresses', async function () {
    expect(await marketFactory.usdc()).to.equal(usdc)
    expect(await marketFactory.eurc()).to.equal(eurc)
  })

  it('Should create a new market', async function () {
    const question = 'Will it rain tomorrow?'
    const endDate = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
    const oracle = ethers.Wallet.createRandom().address
    
    const tx = await marketFactory.createMarket(question, endDate, oracle, usdc)
    const receipt = await tx.wait()
    
    expect(receipt).to.not.be.null
    
    const market = await marketFactory.getMarket(0)
    expect(market.question).to.equal(question)
    expect(market.endDate).to.equal(endDate)
    expect(market.oracle).to.equal(oracle)
    expect(market.currency).to.equal(usdc)
  })

  it('Should reject invalid currency', async function () {
    const invalidCurrency = ethers.Wallet.createRandom().address
    const endDate = Math.floor(Date.now() / 1000) + 86400
    const oracle = ethers.Wallet.createRandom().address
    
    await expect(
      marketFactory.createMarket('Test', endDate, oracle, invalidCurrency)
    ).to.be.revertedWith('Invalid currency')
  })

  it('Should reject past end date', async function () {
    const pastDate = Math.floor(Date.now() / 1000) - 86400
    const oracle = ethers.Wallet.createRandom().address
    
    await expect(
      marketFactory.createMarket('Test', pastDate, oracle, usdc)
    ).to.be.revertedWith('Invalid end date')
  })
})

