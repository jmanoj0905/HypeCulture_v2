import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@three': path.resolve(__dirname, './src/three'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@context': path.resolve(__dirname, './src/context'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/hypeculture',
        changeOrigin: true,
      },
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor'
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three'
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'gsap'
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts'
          }
        },
      },
    },
  },
})
