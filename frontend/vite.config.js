import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

function swVersionPlugin() {
  const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

  return {
    name: 'sw-version',
    configureServer(server) {
      server.middlewares.use('/sw.js', (_req, res) => {
        const src = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf-8')
        res.setHeader('Content-Type', 'application/javascript')
        res.end(src.replace('__SW_VERSION__', version))
      })
    },
    generateBundle() {
      const src = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf-8')
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: src.replace('__SW_VERSION__', version),
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), swVersionPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  test: {
    environment: 'node',
    testTimeout: 20000,
  },
})
