<template>
  <div>
    <VButton ref="buttonRef" type="success" plain @click="console.log(1111)">按钮</VButton>
    <VButton type="primary" loading>按钮</VButton>
    <VButton type="primary" icon="house">按钮</VButton>
    <Collapse v-model="openValue" accordion>
      <Item name="a">
        <template #title>
          <h1>nice title</h1>
        </template>
        <h1>headline title</h1>
        <div>this is content a aaa</div>
      </Item>
      <Item name="b" title="Title B">
        <div>this is bbbbb test</div>
      </Item>
      <Item name="c" title="Disabled Title" disabled>
        <div>this is cccc test</div>
      </Item>
    </Collapse>
    <icon :icon="'user-secret'" color="#ff0000"></icon>
    {{ openValue }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ButtonInstance } from './components/Button/types'
import VButton from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
const buttonRef = ref<ButtonInstance | null>(null)
onMounted(() => {
  console.log(buttonRef.value?.a)
})
const openValue = ref(['a'])
</script>

<style scoped></style>
