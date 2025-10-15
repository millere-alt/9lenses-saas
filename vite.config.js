import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth-vendor': ['@auth0/auth0-react', '@azure/msal-browser', '@azure/msal-react'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'api-vendor': ['axios', '@anthropic-ai/sdk'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild',
  },
})
