<script setup lang="ts">
import { useAttrs } from 'vue';
import ChildCon from './Child-Con.vue';
// 阻止默认的透传attrs
defineOptions({
  inheritAttrs: false
})
const props = defineProps<{
  attr1: string,
}>()
console.log('father组件禁止根元素继承默认的attrs，但是将透传的attr1声明为props并接受', props);

const attrs = useAttrs();
console.log('attr1被props或emits消费，只剩下attr2', attrs);
</script>

<template>
  <ChildCon attr3="attr3" />
</template>