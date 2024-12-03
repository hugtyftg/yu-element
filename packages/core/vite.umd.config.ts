import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'YuElement',
      fileName: 'index',
      formats: ['umd'],
    },
    // vite开发模式下基于esbuild，生产模式下基于rollup，正在开发roll down取代esbuild和rollup
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
        // 将style.css都打包到index.css
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'index.css';
          }
          return assetInfo.name as string;
        },
      },
    },
  },
});
