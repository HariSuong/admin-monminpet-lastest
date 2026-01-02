import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.monminpet.com'
      },
      {
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com'
      }
    ]
  }
}

export default nextConfig
