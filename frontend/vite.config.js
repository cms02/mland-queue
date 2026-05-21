import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // /api로 시작하는 모든 요청을 Spring Boot 백엔드로 토스
      '/api': {
        target: 'http://localhost:8080', // :module-api가 구동 중인 포트로 지정
        changeOrigin: true,
        secure: false,
      }
    }
  }
})