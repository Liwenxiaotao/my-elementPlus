<template>
  <i class="vk-icon" :class="{[`vk-icon-${type}`]: type}" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="$props"></font-awesome-icon>
  </i>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconProps } from "./types"

defineOptions({
    name: 'VkIcon',
    inheritAttrs: false
})

const props = defineProps<IconProps>()

const customStyles = computed(() => {
    return props.color ? {color: props.color} : {}
})
</script>

<style scoped>

</style>