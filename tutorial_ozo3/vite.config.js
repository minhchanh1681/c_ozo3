import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Lắng nghe tất cả các địa chỉ IP
    port: 5173,       // Cổng mà bạn muốn sử dụng
  },
})
