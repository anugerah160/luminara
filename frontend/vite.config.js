import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/luminara/',
  plugins: [react()],
  server : {
    host : true, port: 5173
  }
})
