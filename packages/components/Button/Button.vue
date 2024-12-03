<script setup lang="ts">
import { computed, inject, ref } from "vue";
import type { ButtonEmits, ButtonExpose, ButtonProps } from "./types";
import { throttle } from "lodash-es";
import { BUTTON_GROUP_KEY } from "./constant";
import { YuIcon } from "../Icon";
defineOptions({
  name: "ErButton",
});

/* 响应式props的默认值覆盖 */
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: 'button',
  nativeType: 'button',
  disabled: false,
  useThrottle: true,
  throttleDuration: 10000
});

/* 将ButtonGroup内的配置和props内的配置综合的到最终配置 */
const context = inject(BUTTON_GROUP_KEY);
const size = computed(() => context?.size ?? props?.size ?? 'default');
const type = computed(() => context?.type ?? props?.type ?? 'primary');
const disabled = computed(() => context?.disabled ?? props.disabled);

/* 插槽 */
const slots = defineSlots();

/* 图标样式（按钮内有插槽文字时，需要设置间隔） */
const iconStyle = computed(() => ({ marginRight: slots.default ? '6px' : '0px' }))

/* 事件 */
const emit = defineEmits<ButtonEmits>();
const handleClick = (e: MouseEvent) => emit('click', e);
// trailing和leading决定函数invoke执行时机是在节流开始时还是结束时
const throttleHandleClick = throttle(handleClick, props.throttleDuration, { trailing: false, });

/* 子传父 */
const _ref = ref<HTMLButtonElement>();
defineExpose<ButtonExpose>({
  ref: _ref
});
</script>

<template>
  <component :is="tag" ref="_ref" class="yu-button" :class="{
    [`yu-button--${type}`]: type,
    [`yu-button--${size}`]: size,
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-disabled': disabled,
    'is-loading': props.loading,
  }" :disabled="disabled || props.loading ? true : void 0" :autofocus="props.autofocus"
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

    <slot></slot>
  </component>
</template>

<style scoped>
@import './style.css';
</style>