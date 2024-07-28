<template>
  <div class="vk-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { NameType, CollapseProps, CollapseEmits } from './types.ts'
import { collapseContextKey } from './types'

defineOptions({
  name: 'VKCollapse'
})

const model = defineModel<NameType[]>({ required: true })

const props = defineProps<CollapseProps>()

const emits = defineEmits<CollapseEmits>()

const activeNames = ref<NameType[]>(model.value)

watch(model, () => {
  activeNames.value = model.value
})

const handleItemClick = (item: NameType) => {
  if (props.accordion) {
    activeNames.value = activeNames.value[0] === item ? [] : [item]
  } else {
    const index = activeNames.value.indexOf(item)
    if (index > -1) {
      activeNames.value.splice(index, 1)
    } else {
      activeNames.value.push(item)
    }
  }
  model.value = activeNames.value
  emits('change', activeNames.value)
}

provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
</script>

<style scoped></style>
