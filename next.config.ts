import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
export default withNextIntl(nextConfig)
