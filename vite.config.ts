import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3006, strictPort: true },
  preview: { port: 3006, strictPort: true },
  resolve: { alias: { '@': `${import.meta.dirname}/src` } }
})
