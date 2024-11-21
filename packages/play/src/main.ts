import { createApp } from 'vue';
import App from './App.vue';
// 导出installer
import YuElement from 'yu-element';

createApp(App)
  // 注册组件库
  .use(YuElement)
  .mount('#app');
