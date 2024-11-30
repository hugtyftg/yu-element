<script setup lang="ts">
import { computed, ref } from "vue";
import type { ButtonEmits, ButtonExpose, ButtonProps } from "./types";
import { throttle } from "lodash-es";
import { YuIcon } from "yu-element";
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

// 图标样式（按钮内有插槽文字时，需要设置间隔）
const iconStyle = computed(() => ({ marginRight: slots.default ? '6px' : '0px' }))

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
  }" :disabled="props.disabled || props.loading ? true : void 0" :autofocus="props.autofocus"
    :type="props.tag === 'button' ? props.nativeType : void 0"
    @click="(e: MouseEvent) => props.useThrottle ? throttleHandleClick(e) : handleClick(e)">

    <!-- loading图标样式 -->
    <template v-if="props.loading">
      <slot name="loading">
        <YuIcon class="loading-icon" :icon="loadingIcon ?? 'spinner'" :style="iconStyle" size="1x" />
      </slot>
    </template>

    <!-- 不loading时的默认图标样式 -->
    <YuIcon v-if="props.icon && !props.loading" :icon="props.icon" :style="iconStyle" />

    <slot>default slot</slot>
  </component>
</template>

<style scoped>
@import './style.css';
</style>