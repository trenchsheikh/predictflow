import { expect } from 'chai'
import { ethers } from 'hardhat'
import { PredictionMarket } from '../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'

describe('PredictionMarket', function () {
  let market: PredictionMarket
  let usdc: any
  let oracle: SignerWithAddress
  let trader1: SignerWithAddress
  let trader2: SignerWithAddress
  let owner: SignerWithAddress

  const INITIAL_LIQUIDITY = ethers.parseUnits('1000', 6) // 1000 USDC
  const TRADE_AMOUNT = ethers.parseUnits('100', 6) // 100 USDC

  beforeEach(async function () {
    ;[owner, oracle, trader1, trader2] = await ethers.getSigners()

    // Deploy mock USDC token
    const MockERC20 = await ethers.getContractFactory('MockERC20')
    usdc = await MockERC20.deploy('USD Coin', 'USDC', 6)
    await usdc.waitForDeployment()

    // Mint USDC to traders
    await usdc.mint(trader1.address, ethers.parseUnits('10000', 6))
    await usdc.mint(trader2.address, ethers.parseUnits('10000', 6))

    // Deploy PredictionMarket
    const question = 'Will ETH reach $5000 by end of 2024?'
    const endDate = Math.floor(Date.now() / 1000) + 86400 * 30 // 30 days from now

    const PredictionMarketFactory = await ethers.getContractFactory('PredictionMarket')
    market = await PredictionMarketFactory.deploy(
      question,
      endDate,
      oracle.address,
      await usdc.getAddress()
    )
    await market.waitForDeployment()

    // Approve market to spend USDC
    await usdc.connect(trader1).approve(await market.getAddress(), ethers.MaxUint256)
    await usdc.connect(trader2).approve(await market.getAddress(), ethers.MaxUint256)
  })

  describe('Deployment', function () {
    it('Should set the correct initial parameters', async function () {
      expect(await market.question()).to.equal('Will ETH reach $5000 by end of 2024?')
      expect(await market.oracle()).to.equal(oracle.address)
      expect(await market.settled()).to.equal(false)
    })

    it('Should initialize with equal YES/NO liquidity', async function () {
      expect(await market.yesShares()).to.equal(INITIAL_LIQUIDITY)
      expect(await market.noShares()).to.equal(INITIAL_LIQUIDITY)
    })

    it('Should initialize with 50/50 prices', async function () {
      const yesPrice = await market.getPrice(true)
      const noPrice = await market.getPrice(false)
      expect(yesPrice).to.equal(5000) // 50.00%
      expect(noPrice).to.equal(5000) // 50.00%
    })
  })

  describe('Trading', function () {
    it('Should allow buying YES shares', async function () {
      const tx = await market.connect(trader1).buyShares(true, TRADE_AMOUNT)
      await tx.wait()

      const [yesBalance, noBalance] = await market.getPosition(trader1.address)
      expect(yesBalance).to.be.gt(0)
      expect(noBalance).to.equal(0)
    })

    it('Should allow buying NO shares', async function () {
      const tx = await market.connect(trader1).buyShares(false, TRADE_AMOUNT)
      await tx.wait()

      const [yesBalance, noBalance] = await market.getPosition(trader1.address)
      expect(yesBalance).to.equal(0)
      expect(noBalance).to.be.gt(0)
    })

    it('Should update prices after trades', async function () {
      const initialYesPrice = await market.getPrice(true)

      await market.connect(trader1).buyShares(true, TRADE_AMOUNT)

      const newYesPrice = await market.getPrice(true)
      expect(newYesPrice).to.be.gt(initialYesPrice)
    })

    it('Should emit Trade event', async function () {
      await expect(market.connect(trader1).buyShares(true, TRADE_AMOUNT))
        .to.emit(market, 'Trade')
        .withArgs(trader1.address, true, TRADE_AMOUNT, expect.any(BigInt), expect.any(BigInt))
    })

    it('Should revert if market is settled', async function () {
      // Fast forward time
      await ethers.provider.send('evm_increaseTime', [86400 * 31])
      await ethers.provider.send('evm_mine', [])

      // Settle market
      await market.connect(oracle).settle(true)

      await expect(market.connect(trader1).buyShares(true, TRADE_AMOUNT)).to.be.revertedWith(
        'Market settled'
      )
    })

    it('Should handle multiple trades correctly', async function () {
      // Trader 1 buys YES
      await market.connect(trader1).buyShares(true, TRADE_AMOUNT)

      // Trader 2 buys NO
      await market.connect(trader2).buyShares(false, TRADE_AMOUNT)

      const [yes1, no1] = await market.getPosition(trader1.address)
      const [yes2, no2] = await market.getPosition(trader2.address)

      expect(yes1).to.be.gt(0)
      expect(no2).to.be.gt(0)
    })
  })

  describe('Liquidity', function () {
    it('Should allow adding liquidity', async function () {
      const liquidityAmount = ethers.parseUnits('500', 6)

      await usdc.connect(trader1).approve(await market.getAddress(), liquidityAmount)
      await market.connect(trader1).addLiquidity(liquidityAmount)

      const yesShares = await market.yesShares()
      const noShares = await market.noShares()

      expect(yesShares).to.be.gt(INITIAL_LIQUIDITY)
      expect(noShares).to.be.gt(INITIAL_LIQUIDITY)
    })

    it('Should emit LiquidityAdded event', async function () {
      const liquidityAmount = ethers.parseUnits('500', 6)

      await usdc.connect(trader1).approve(await market.getAddress(), liquidityAmount)
      await expect(market.connect(trader1).addLiquidity(liquidityAmount))
        .to.emit(market, 'LiquidityAdded')
        .withArgs(trader1.address, liquidityAmount)
    })
  })

  describe('Settlement', function () {
    beforeEach(async function () {
      // Add some trades
      await market.connect(trader1).buyShares(true, TRADE_AMOUNT)
      await market.connect(trader2).buyShares(false, TRADE_AMOUNT)

      // Fast forward time past end date
      await ethers.provider.send('evm_increaseTime', [86400 * 31])
      await ethers.provider.send('evm_mine', [])
    })

    it('Should allow oracle to settle market', async function () {
      await market.connect(oracle).settle(true)

      expect(await market.settled()).to.equal(true)
      expect(await market.outcome()).to.equal(true)
    })

    it('Should emit Settled event', async function () {
      await expect(market.connect(oracle).settle(true))
        .to.emit(market, 'Settled')
        .withArgs(true)
    })

    it('Should revert if non-oracle tries to settle', async function () {
      await expect(market.connect(trader1).settle(true)).to.be.revertedWith('Only oracle')
    })

    it('Should revert if settling before end date', async function () {
      // Deploy new market with future end date
      const futureDate = Math.floor(Date.now() / 1000) + 86400 * 60
      const PredictionMarketFactory = await ethers.getContractFactory('PredictionMarket')
      const futureMarket = await PredictionMarketFactory.deploy(
        'Future market',
        futureDate,
        oracle.address,
        await usdc.getAddress()
      )

      await expect(futureMarket.connect(oracle).settle(true)).to.be.revertedWith(
        'Market not ended'
      )
    })

    it('Should allow winners to redeem shares', async function () {
      await market.connect(oracle).settle(true)

      const [yesBalance] = await market.getPosition(trader1.address)
      const initialUSDC = await usdc.balanceOf(trader1.address)

      await market.connect(trader1).redeem()

      const finalUSDC = await usdc.balanceOf(trader1.address)
      expect(finalUSDC).to.be.gt(initialUSDC)
    })

    it('Should revert if losers try to redeem', async function () {
      await market.connect(oracle).settle(true) // YES wins

      // Trader2 holds NO shares, should fail
      await expect(market.connect(trader2).redeem()).to.be.revertedWith('No winning shares')
    })

    it('Should revert redeem if market not settled', async function () {
      await expect(market.connect(trader1).redeem()).to.be.revertedWith('Market not settled')
    })
  })

  describe('Edge Cases', function () {
    it('Should handle zero amount trades', async function () {
      await expect(market.connect(trader1).buyShares(true, 0)).to.be.revertedWith(
        'Amount must be > 0'
      )
    })

    it('Should handle insufficient balance', async function () {
      const largeAmount = ethers.parseUnits('100000', 6)
      await expect(market.connect(trader1).buyShares(true, largeAmount)).to.be.reverted
    })

    it('Should prevent double settlement', async function () {
      await ethers.provider.send('evm_increaseTime', [86400 * 31])
      await ethers.provider.send('evm_mine', [])

      await market.connect(oracle).settle(true)
      await expect(market.connect(oracle).settle(false)).to.be.revertedWith('Already settled')
    })
  })

  describe('Market State', function () {
    it('Should return correct market state', async function () {
      const [yesPrice, noPrice, yesLiquidity, noLiquidity, isSettled, marketOutcome] =
        await market.getMarketState()

      expect(yesPrice).to.equal(5000)
      expect(noPrice).to.equal(5000)
      expect(yesLiquidity).to.equal(INITIAL_LIQUIDITY)
      expect(noLiquidity).to.equal(INITIAL_LIQUIDITY)
      expect(isSettled).to.equal(false)
      expect(marketOutcome).to.equal(false)
    })
  })
})

