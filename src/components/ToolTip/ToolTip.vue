<template>
  <div class="vk-tooltip" v-on="outerEvent" ref="popperContainNode">
    <div class="vk-tooltip__trigger" ref="popperNode" v-on="events">
        <slot></slot>
    </div>
    <Transition :name="transition">
        <div v-if="isOpen" class="vk-tooltip__popper" ref="triggerNode">
            <slot name="content">
                {{ content }}
            </slot>
            <div id="arrow" data-popper-arrow></div>
        </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch, onUnmounted, computed} from 'vue'
import type {ToolTipEmit, ToolTipProps, ToolTipInstance} from './types'
import type {Instance} from '@popperjs/core'
import {createPopper} from '@popperjs/core'
import useClickOutside from '@/hooks/useClickOutside'
import { debounce } from 'lodash-es'
defineOptions({
    name: 'VkToolTip'
})

const props = withDefaults(defineProps<ToolTipProps>(), {
    placement: 'bottom',
    trigger: 'hover',
    transition: 'fade',
    openDelay: 0,
    closeDelay: 0
})

const emits = defineEmits<ToolTipEmit>()

const isOpen = ref(false)
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperContainNode = ref<HTMLElement>()
let popperInstance: null | Instance = null
let events: Record<string, any> = reactive({})
let outerEvent: Record<string, any> = reactive({})
const popperOptions = computed(() => {
    return {
        placement: props.placement,
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 9]
            }
        }],
        ...props.popperOptions
    }
})

console.log(popperOptions.value)

const open = () => {
    isOpen.value =true
    emits("visible-change", true)
}

const close = () => {
    isOpen.value =false
    emits("visible-change", false)
}

const openDebouncs = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)

const finalOpenDebouncs = () => {
    closeDebounce.cancel()
    openDebouncs()
}

const finalCloseDebounce = () => {
    openDebouncs.cancel()
    closeDebounce()
}

const togglePopper = () => {
    if (isOpen.value) {
        finalCloseDebounce()
    } else {
        finalOpenDebouncs()
    }
}


const attachEvents = () => {
    if (props.trigger === 'hover') {
        events['mouseenter'] = finalOpenDebouncs
        outerEvent['mouseleave'] = finalCloseDebounce
    } else if (props.trigger === 'click') {
        events['click'] = togglePopper
    }
}
useClickOutside(popperContainNode, () => {
    if (props.trigger === 'click' && isOpen.value && !props.manual) {
        finalCloseDebounce()
    }
    if (isOpen.value) {
        emits('click-outside', true)
    }
})
if (!props.manual) {
    attachEvents()
}

watch(() => props.manual, (isManual) => {
    if (isManual) {
        events = {}
        outerEvent = {}
    } else {
        attachEvents()
    }
})

watch(() => props.trigger, (newV, oldV) => {
    if (newV !== oldV) {
        events = {}
        outerEvent = {}
        attachEvents()
    }
})

watch(isOpen, (newValue) => {
    if (newValue) {
        if (popperNode.value && triggerNode.value) {
            popperInstance = createPopper( popperNode.value, triggerNode.value, popperOptions.value)
        } else {
            popperInstance?.destroy()
        }
    }
}, {flush: 'post'})

onUnmounted(() => {
    popperInstance?.destroy()
})
defineExpose<ToolTipInstance>({
    'show': finalOpenDebouncs,
    'hide': finalCloseDebounce
})
</script>

<style scoped>

</style>