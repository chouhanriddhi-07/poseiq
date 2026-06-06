import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']  // ← prevents Vite bundling issues with MediaPipe
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174',  // Proxy to Vercel dev server
        changeOrigin: true,
      }
    }
  }
})