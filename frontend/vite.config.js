import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // @ belgisi src papkaga yo'naltiriladi
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // node_modules ichidagi paketlarni alohida vendor chunkga ajratish
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,  // Ogohlantirish uchun chunk limitini 1000 KB ga oshirish
  }
});
