// import { install } from '@yu-element/utils';
import { install } from '../utils';
import components from './components';
// 全局导入样式
import '@yu-element/theme/index.css';

// 引入fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

// 注册所有组件的函数
const installer = install(components);

/* 将@yu-element/components的引入路径修改为相对路径，否则dev正常，线上生产环境找不到包会报错 */
// export * from '@yu-element/components';
export * from '../components';
export default installer;
