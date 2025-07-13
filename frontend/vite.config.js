import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cinemasoftserve-8ejj.onrender.com',
        //target: 'http://127.0.0.1:8000',
        changeOrigin: true,              
        //rewrite: path => path.replace(/^\/api/, '/api/v1/public'), 
      },
    },
  }
})

