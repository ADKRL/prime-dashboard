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
  // VITE_COORDINATOR_HOST and VITE_COORDINATOR_PORT are used by App.jsx
  // Example: VITE_COORDINATOR_HOST=abc123.ngrok-free.dev npm run build
})
