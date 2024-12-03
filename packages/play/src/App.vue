<script setup lang="ts">
// 引入组件
import { ref } from 'vue';
import { YuButton, YuButtonGroup } from 'yu-element'
import type { ButtonType } from '../../components/Button/types';

// 深层透传attrs
// import { FatherCon } from './components/attr-inherit';
const type = ref<ButtonType>('primary')
const changeColor = () => {
  type.value = 'warning';
  console.log(type.value);

}
</script>

<template>
  <div>
    <!-- <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton> -->

    <!-- 深层透传attrs -->
    <!-- <FatherCon attr1="attr1" attr2="attr2" /> -->

    <YuButtonGroup :disabled="false" :type="type" size="default">
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
      <YuButton type="primary" size="default" :throttle-duration="1000" @click="() => console.log(123)">test</YuButton>
    </YuButtonGroup>

    <button v-on:click="changeColor">change color</button>
  </div>
</template>
