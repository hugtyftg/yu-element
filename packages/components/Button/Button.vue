<script setup lang="ts">
import { ref } from "vue";
import type { ButtonEmits, ButtonExpose, ButtonProps } from "./types";
import { throttle } from "lodash-es";
defineOptions({
  name: "ErButton",
});

// 响应式props的默认值覆盖
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  useThrottle: true,
  throttleDuration: 500
});

// 插槽
const slots = defineSlots();

// 事件
const emit = defineEmits<ButtonEmits>();
const handleClick = (e: MouseEvent) => emit('click', e);
const throttleHandleClick = throttle(handleClick, props.throttleDuration);

// 子传父
const _ref = ref<HTMLButtonElement>();
defineExpose<ButtonExpose>({
  ref: _ref
});
</script>

<template>
  <component :is="tag" ref="_ref" class="yu-button" :class="{
    [`yu-button--${type}`]: props.type,
    [`yu-button--${size}`]: props.size,
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-disabled': props.disabled,
    'is-loading': props.loading,
  }" :disabled="props.disabled || props.loading ? true : void 0"
    :type="props.tag === 'button' ? props.nativeType : void 0"
    @click="(e: MouseEvent) => props.useThrottle ? throttleHandleClick(e) : handleClick(e)">
    <slot>default slot</slot>
  </component>
</template>

<style scoped>
@import './style.css';
</style>