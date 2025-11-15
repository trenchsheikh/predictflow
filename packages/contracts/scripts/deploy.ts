import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const [deployer] = await ethers.getSigners()
  
  console.log('Deploying contracts with account:', deployer.address)
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString())
  
  // Get contract addresses from environment
  const usdcAddress = process.env.USDC_ADDRESS
  const eurcAddress = process.env.EURC_ADDRESS
  
  if (!usdcAddress || !eurcAddress) {
    throw new Error('USDC_ADDRESS and EURC_ADDRESS must be set in .env')
  }
  
  // Deploy MarketFactory
  console.log('Deploying MarketFactory...')
  const MarketFactory = await ethers.getContractFactory('MarketFactory')
  const marketFactory = await MarketFactory.deploy(usdcAddress, eurcAddress)
  await marketFactory.waitForDeployment()
  const marketFactoryAddress = await marketFactory.getAddress()
  console.log('MarketFactory deployed to:', marketFactoryAddress)
  
  // Deploy MarketMirror
  console.log('Deploying MarketMirror...')
  const MarketMirror = await ethers.getContractFactory('MarketMirror')
  const marketMirror = await MarketMirror.deploy(marketFactoryAddress, usdcAddress)
  await marketMirror.waitForDeployment()
  const marketMirrorAddress = await marketMirror.getAddress()
  console.log('MarketMirror deployed to:', marketMirrorAddress)
  
  console.log('\n=== Deployment Summary ===')
  console.log('MarketFactory:', marketFactoryAddress)
  console.log('MarketMirror:', marketMirrorAddress)
  console.log('\nUpdate your .env with these addresses')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

