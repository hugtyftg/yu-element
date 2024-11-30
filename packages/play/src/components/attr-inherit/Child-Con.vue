<script setup lang="ts">
import { useAttrs } from 'vue';

defineOptions({
  // 组织深层根元素的透传
  inheritAttrs: false
})
// js中访问attrs
const attrs = useAttrs();
console.log('child组件禁止跟组件默认继承透传的attrs，并将它们收集到attrs对象中', attrs);

</script>
<template>
  <div>
    <!-- 模版中访问attrs，将透传的attrs绑定在非根元素上 -->
    <p v-bind="$attrs">child</p>
  </div>
</template>