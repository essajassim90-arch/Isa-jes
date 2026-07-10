import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build' && !process.env.VITE_WC_PROJECT_ID) {
    throw new Error(
      '\n\nMissing required environment variable: VITE_WC_PROJECT_ID\n' +
      'Set this in .env.local for local builds or via CI secrets for production.\n',
    )
  }

  return {
    plugins: [react()],
    base: '/Isa-jes/',
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === 'INVALID_ANNOTATION' &&
            warning.id?.includes('@privy-io/react-auth/dist/esm/index.mjs')
          ) {
            return
          }
          warn(warning)
        },
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('react') || id.includes('scheduler')) return 'vendor-react'
            if (id.includes('@vechain')) return 'vendor-vechain'
            if (
              id.includes('@reown') ||
              id.includes('@walletconnect') ||
              id.includes('@web3modal') ||
              id.includes('@privy-io')
            ) {
              return 'vendor-wallet'
            }
            if (id.includes('wagmi') || id.includes('viem') || id.includes('ethers')) {
              return 'vendor-web3-core'
            }

            return 'vendor-misc'
          },
        },
      },
    },
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        buffer: 'buffer',
        '@nama/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      },
    },
    optimizeDeps: {
      include: ['buffer'],
    },
  }
})
