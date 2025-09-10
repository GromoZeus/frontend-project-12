import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          ui: ['react-bootstrap', 'bootstrap', 'react-toastify'],
          form: ['formik', 'yup'],
          utils: ['axios', 'socket.io-client', 'leo-profanity', 'react-i18next', 'i18next'],
        },
      },
    },
  },
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
      },
      '/socket.io': {
        target: 'ws://localhost:5001',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})
