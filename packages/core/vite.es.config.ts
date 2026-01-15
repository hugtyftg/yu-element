import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { includes } from 'lodash-es';
import { readdirSync } from 'fs';

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export default defineConfig({
  plugins: [
    vue(),
    // 为esm分包书写.d.ts类型声明文件，并且遵守指定的tsconfig约束
    dts({
      tsconfigPath: '../../tsconfig.build.json',
      outDir: 'dist/types',
    }),
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      // 打包入口文件
      entry: resolve(__dirname, './index.ts'),
      // UMD模式下本库会作为cdn从script中引入，此时本库暴露给window的全局变量名称
      name: 'YuElement',
      // 打包输出的包文件名，默认package.json的name选项
      fileName: 'index',
      // 默认的 formats 为 ['es'、'umd']，如果使用多个入口，则为 ['es'、'cjs']
      formats: ['es'],
    },
    // vite开发模式下基于esbuild，生产模式下基于rollup，正在开发roll down取代esbuild和rollup
    rollupOptions: {
      // 外部化第三方依赖：external属性里写不想打包进去的第三方库，例如vue、lodash等
      external: [
        'vue',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        '@popperjs/core',
        'async-validator',
      ],
      output: {
        // 同时使用 默认导出（default export）和 具名导出（named exports），默认导出优先
        exports: 'named',
        // 外部化第三方依赖的映射：在 UMD 构建模式下为外部化的第三方依赖提供一个全局变量
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
        // 分包
        manualChunks(id) {
          // 第三方依赖
          if (includes(id, 'node_modules')) return 'vendor';
          // hooks子包
          if (includes(id, '/packages/hooks')) return 'hooks';
          // utils子包和导出相关的工具
          if (
            includes(id, '/packages/utils') ||
            includes(id, 'plugin-vue:export-helper')
          ) {
            return 'utils';
          }
          // 每个component单独是一个文件chuck
          const COMPS = getDirectoriesSync('../components');
          for (const chunkName of COMPS) {
            if (includes(id, `/packages/components/${chunkName}`))
              return chunkName;
          }
        },
      },
    },
  },
});
