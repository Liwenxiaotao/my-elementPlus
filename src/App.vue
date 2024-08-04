<template>
  <div>
    <Dropdown
      trigger="click"
      :menu-options="options"
      @visible-change="mConsole('visible change')"
      @select="(e) => mConsole('select', e)"
    >
      <img src="./assets/logo.svg" width="100" height="100" />
    </Dropdown>
    <div>
      <VButton ref="buttonRef" type="success" plain @click="console.log(1111)">按钮</VButton>
      <VButton type="primary" loading>按钮</VButton>
      <VButton type="primary" icon="house">按钮</VButton>
    </div>
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
import { onMounted, ref, h } from 'vue'
import type { ButtonInstance } from './components/Button/types'
import VButton from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'
import Icon from './components/Icon/Icon.vue'
import ToolTip from './components/ToolTip/ToolTip.vue'
import Dropdown from './components/Dropdown/Dropdown'
import type { MenuOption } from '@/components/Dropdown/types'
import Message from './components/Message/Message.vue'
import { createMessage } from './components/Message/Message'
const buttonRef = ref<ButtonInstance | null>(null)
const mConsole = (...arg: any) => {
  console.log(...arg)
}
onMounted(() => {
  console.log(buttonRef.value?.a)
  const instance = createMessage({ message: 'aaa', duration: 0, type: 'success' })
  createMessage({ message: 'bbb', duration: 3000, type: 'warning' }),
    createMessage({ message: 'ccc', duration: 5000, type: 'danger' })
  setTimeout(() => {
    instance.close()
  }, 1000)
})
const openValue = ref(['a'])
const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' }
]
</script>

<style scoped></style>
