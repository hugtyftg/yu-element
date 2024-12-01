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
  size: toRef(props.size),
  type: toRef(props.type),
  disabled: toRef(props.disabled)
}))

</script>
<style scoped>
@import './style.css';
</style>