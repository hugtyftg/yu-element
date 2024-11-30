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

export * from '@yu-element/components';
export default installer;
