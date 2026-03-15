import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Memastikan path aset relatif untuk menghindari blank screen di sub-direktori
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})