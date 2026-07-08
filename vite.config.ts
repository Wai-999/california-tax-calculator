import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base is set to the GitHub Pages project path so the built app resolves
// assets correctly when served from https://<user>.github.io/california-tax-calculator/
export default defineConfig({
  base: '/california-tax-calculator/',
  plugins: [react(), tailwindcss()],
})
