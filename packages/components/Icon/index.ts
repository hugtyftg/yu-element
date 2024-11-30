import { withInstall } from '@yu-element/utils';
import Icon from './Icon.vue';

// 给icon组件注册install方法使之成为Plugin
export const YuIcon = withInstall(Icon);
