import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'
// import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // checker({
    //   eslint: {
    //     // for example, lint .ts and .tsx
    //     lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
    //   }
    // }),
    vue(),
    vueJsx(),
    eslint()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
