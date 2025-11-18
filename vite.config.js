import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  // Environment variables (prefixed with VITE_)
  // Can be set via .env files or command line
  // Example: VITE_COORDINATOR_HOST=192.168.1.100 npm run build
})
