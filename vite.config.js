import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = názov GitHub Pages repa, aby sa assety načítali z /allrisk-web-prototyp/.
// V dev (npm run dev) je base '/', v builde '/allrisk-web-prototyp/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/allrisk-web-prototyp/' : '/',
  plugins: [react()],
  server: { host: true, port: 5188 },
}))
