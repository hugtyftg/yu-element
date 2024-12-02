import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    // 为esm分包书写.d.ts类型声明文件，并且遵守指定的tsconfig约束
    dts({
      tsconfigPath: '../../tsconfig.build.json',
      outDir: 'dist/type',
    }),
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'YuElement',
      fileName: 'index',
      formats: ['es'],
    },
    // vite开发模式下基于esbuild，生产模式下基于rollup，正在开发roll down取代esbuild和rollup
    rollupOptions: {
      // 剥离第三方库。我们在自己的库中需要使用第三方库，例如lodash等，又不想在最终生成的打包文件中出现jquery。这个时候我们就需要使用external属性。
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        '@popperjs/core',
        'async-validator',
      ],
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
