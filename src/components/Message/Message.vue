<template>
  <Transition :name="transitionName" @after-leave="destroyComponent" @enter="updateHeight">
    <div
      class="vk-message"
      :class="{
        [`vk-message--${type}`]: type,
        'is-close': showClose
      }"
      v-show="visible"
      ref="messageRef"
      :style="cssStyle"
      @mouseleave="startTimer"
      @mouseenter="clearTimer"
    >
      <div class="vk-message__content">
        <slot>
          <RenderVnode :v-node="message" v-if="message" />
        </slot>
      </div>
      <div class="vk-message__close" v-if="showClose">
        <Icon @click.stop="($event) => (visible = false)" icon="xmark"></Icon>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import type { MessageProps } from './types'
import RenderVnode from '../Common/RenderVnode'
import Icon from '../Icon/Icon.vue'
import { getLastBottomOffset } from './Message'
import useEventListener from '../../hooks/useEventListener'
defineOptions({
  name: 'VkMessage'
})
const props = withDefaults(defineProps<MessageProps>(), {
  duration: 3000,
  type: 'info',
  offset: 20,
  transitionName: 'fade-up'
})
const visible = ref(false)
const messageRef = ref<HTMLElement>()
// 计算便宜高度
// div的高度
const height = ref(0)
// 上一个实例的最下面的坐标数字， 第一个0
const lastOffset = computed(() => getLastBottomOffset(props.id))
// 这个元素应该使用的top
const topOffset = computed(() => lastOffset.value + props.offset)
// 这个元素为下一个元素预留的offset
const bottomOffset = computed(() => topOffset.value + height.value)
const cssStyle = computed(() => ({
  top: topOffset.value + 'px',
  zIndex: props.zIndex
}))
onMounted(() => {
  visible.value = true
  nextTick(() => {
    // height.value = messageRef.value!.getBoundingClientRect().height
    startTimer()
  })
})
let timer: any
function startTimer() {
  if (props.duration === 0) return
  timer = setTimeout(() => {
    visible.value = false
  }, props.duration)
}
function clearTimer() {
  clearTimeout(timer)
}
function keydown(e: Event) {
  const event = e as KeyboardEvent
  if (event.key === 'Escape') {
    visible.value = false
  }
}
useEventListener(document, 'keydown', keydown)
// watch(visible, (newV) => {
//   if (!newV) {
//     props.destroy()
//   }
// })
function destroyComponent() {
  props.destroy()
}
function updateHeight() {
  height.value = messageRef.value!.getBoundingClientRect().height
}
defineExpose({ bottomOffset, visible })
</script>

<style scoped></style>
