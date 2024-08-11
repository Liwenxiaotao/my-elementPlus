<template>
  <div>
    {{ inputValue }}
    <VInput type="text" v-model="inputValue" :clearable="true" showPassword>
      <template #prepend> aaa </template>
      <template #append> bbb </template>
      <template #prefix>
        <Icon icon="user"></Icon>
      </template>
    </VInput>
    {{ switchValue }}
    <VSwitch v-model="switchValue" active-value="right" inactive-value="wrong"></VSwitch>
    <div>
      <Select v-model="test" clearable placeholder="基础选择器，请选择" :options="options2" />
      <span>{{ test }}</span>
    </div>
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
    <Form ref="formRef" :model="form" :rules="rules">
      <FormItem label="name" prop="name">
        <VInput type="text" v-model="form.name" />
      </FormItem>
      <FormItem label="email" prop="email">
        <template #label="{ label }">
          <VButton type="success">{{ label }}</VButton>
        </template>
        <VInput type="text" v-model="form.email" />
      </FormItem>
      <FormItem>
        <VButton @click.prevent="submit" type="primary">提交</VButton>
        <VButton @click.prevent="reset" type="primary" plain>重置</VButton>
      </FormItem>
    </Form>

    <p>{{ form }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h, reactive } from 'vue'
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
import VInput from './components/Input/Input.vue'
import VSwitch from './components/Switch/Switch.vue'
import Select from './components/Select/Select.vue'
import Form from './components/Form/Form.vue'
import FormItem from './components/Form/FormItem.vue'
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
    inputValue.value = 'bbb'
  }, 1000)
})
const openValue = ref(['a'])
const options: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') },
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item41' }
]
const options2 = [
  { label: 'hello', value: '1' },
  { label: 'xyz', value: '2' },
  { label: 'testing', value: '3' },
  { label: 'check', value: '4', disabled: true }
]
const test = ref('')
const inputValue = ref('aaa')
const switchValue = ref('right')
const customRender = (option: any) => {
  return h('div', { className: 'xyz' }, [h('b', option.label), h('span', option.value)])
}
const handleFetch = (query: string) => {
  if (!query) return Promise.resolve([])
  return fetch(`https://api.github.com/search/repositories?q=${query}`)
    .then((res) => res.json())
    .then(({ items }) => {
      return items.slice(0, 10).map((item: any) => {
        return {
          label: item.name,
          value: item.node_id
        }
      })
    })
}
const form = reactive({
  name: '',
  email: ''
})
const rules = reactive({
  name: [
    { type: 'string', required: true, message: 'Please input your name', trigger: 'blur' },
    { type: 'string', required: true, trigger: 'input' }
  ],
  email: [{ type: 'email', required: true, trigger: 'blur' }]
})
const formRef = ref()
const submit = async () => {
  try {
    await formRef.value?.validate()
    console.log('submit success')
  } catch (e) {
    console.log('error', e)
  }
}
const reset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped></style>
