/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ARC_RPC_URL: process.env.NEXT_PUBLIC_ARC_RPC_URL,
    NEXT_PUBLIC_ARC_CHAIN_ID: process.env.NEXT_PUBLIC_ARC_CHAIN_ID,
    NEXT_PUBLIC_CIRCLE_APP_ID: process.env.NEXT_PUBLIC_CIRCLE_APP_ID,
  },
}

export default nextConfig
