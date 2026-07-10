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
            warning.message?.includes(
              'contains an annotation that Rollup cannot interpret due to the position of the comment',
            )
          ) {
            return
          }
          warn(warning)
        },
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('@vechain/vechain-kit')) return 'vendor-vechain-kit'
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
