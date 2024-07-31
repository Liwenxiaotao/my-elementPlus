<template>
  <div class="vk-tooltip">
    <div class="vk-tooltip__trigger" ref="poperNode" @click="togglePopper">
        <slot></slot>
    </div>
    <div v-if="isOpen" class="vk-tooltip__popper" ref="triggerNode">
        <slot name="content">
            {{ content }}
        </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import type {ToolTipEmit, ToolTipProps} from './types'
import type {Instance} from '@popperjs/core'
defineOptions({
    name: 'VkToolTip'
})

const props = withDefaults(defineProps<ToolTipProps>(), {
    placement: 'bottom'
})
const emits = defineEmits<ToolTipEmit>()

const isOpen = ref(false)
const poperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperInstance: null | Instance = null
const togglePopper = () => {
    isOpen.value = !isOpen.value
    emits("visible-change", isOpen.value)
}
watch(isOpen, (newValue) => {
    if (newValue) {
        if (poperNode.value && triggerNode.value) {

        }
    }
})
</script>

<style scoped>

</style>