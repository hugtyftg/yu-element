<script setup lang="ts">
// 引入组件
import { YuButton } from 'yu-element'
</script>

<template>
  <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
</template>
