<template>
  <div class="yu-button-group">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { provide, reactive, toRef } from 'vue';

import { BUTTON_GROUP_KEY } from './constant';
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type NativeType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'default' | 'large' | 'small';
interface ButtonGroupProps {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

defineOptions({
  name: "ErButtonGroup",
});

const props = defineProps<ButtonGroupProps>()

provide(BUTTON_GROUP_KEY, reactive({
  // size: toRef(props.size) 响应式不生效，因为它接受的是一个纯字符串而已
  // 将响应式对象props的size属性变成一个可读写的ref
  // size: toRef(props, 'size'),
  // 将响应式对象props的size属性变成一个只读的ref
  size: toRef(() => props.size),
  // type: toRef(props, 'type'),
  type: toRef(() => props.type),
  // disabled: toRef(props, 'disabled')
  disabled: toRef(() => props.disabled)
}))

</script>
<style scoped>
@import './style.css';
</style>