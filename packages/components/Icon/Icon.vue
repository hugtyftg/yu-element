<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { IconProps } from './types';
import { omit } from 'lodash-es';
defineOptions({
  name: 'YuIcon',
  // 禁用 Attributes 继承，设置根元素不默认继承透传参数
  // 场景：attribute 需要应用在根节点以外的其他元素上
  inheritAttrs: false
})
const props = defineProps<IconProps>();
// 不对icon直接设置type和color属性，而是给i标签设置
const filterProps = computed(() => omit(props, ['type', 'color']));
const customStyle = computed(() => ({ color: props.color ?? void 0 }));
</script>

<template>
  <!-- 通过$attrs在模版中访问所有透传属性，包含了除组件所声明的 props 和 emits 之外的所有其他 attribute，例如 class，style，v-on 监听器等等 -->
  <i class="yu-icon" :class="`yu-icon-${props.type}`" :style="customStyle" v-bind="$attrs">
    <FontAwesomeIcon v-bind="filterProps" />
  </i>
</template>

<style>
@import './style.css';
</style>