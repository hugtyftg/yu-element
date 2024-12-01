<script setup lang="ts">
// 引入组件
import { YuButton, YuButtonGroup } from 'yu-element'

// 深层透传attrs
// import { FatherCon } from './components/attr-inherit';
</script>

<template>
  <div>
    <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>

    <!-- 深层透传attrs -->
    <!-- <FatherCon attr1="attr1" attr2="attr2" /> -->

    <YuButtonGroup :disabled="false" type="warning" size="default">
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
    </YuButtonGroup>
  </div>
</template>
