import Button from './Button.vue';
import { withInstall } from '@yu-element/utils';
import ButtonGroup from './ButtonGroup.vue';

// 给button组件注册install方法使之成为Plugin
export const YuButton = withInstall(Button);
export const YuButtonGroup = withInstall(ButtonGroup);
