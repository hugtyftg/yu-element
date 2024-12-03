import { createApp } from 'vue';
import App from './App.vue';
// 导出installer
import YuElement from 'yu-element-core';
// 引入yu-element样式
import 'yu-element-core/dist/index.css';

createApp(App)
  // 注册组件库
  .use(YuElement)
  .mount('#app');
