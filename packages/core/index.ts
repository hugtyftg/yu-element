import { install } from '@yu-element/utils';
import components from './components';
// 全局导入样式
import '@yu-element/theme/index.css';

// 引入fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

// 注册所有组件的函数
const installer = install(components);

/* 将@yu-element/components的引入路径修改为相对路径，否则打包结果types引用错误，没有引用dist内打包生成的types

  // core/dist/type/core/index.d.ts
  // 正确的打包结果
  declare const installer: (app: import('vue').App) => import('vue').Plugin[];
  export * from '../components';
  export default installer;

  // 错误的打包结果，没有引用dist内打包生成的types
  declare const installer: (app: import('vue').App) => import('vue').Plugin[];
  export * from '@yu-element/components';
  export default installer;
*/
// export * from '@yu-element/components';
export * from '../components';
export default installer;
