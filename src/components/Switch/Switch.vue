<template>
  <div 
    class="vk-switch"
    :class="{
        [`vk-switch--${size}`]: size,
        'is-disabled': disabled,
        'is-checked': checked
    }"
    @click="switchValue"
>
    <input 
        ref="input"
        class="vk-switch__input" 
        type="checkbox" 
        role="switch"
        :name="name"
        :disabled="disabled"
        @keydown.enter="switchValue"/>
    <div class="vk-switch__core">
        <div class="vk-switch__core-inner">
            <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">
                {{ checked ? activeText : inactiveText }}
            </span>
        </div>
        <div class="vk-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type {SwitchEmits, SwitchProps, SwitchValueType} from './types'
defineOptions({
    name: 'VkSwitch',
    inheritAttrs: false
})
const props = withDefaults(defineProps<SwitchProps>(), {
    activeValue: true,
    inactiveValue: false
})
const emit = defineEmits<SwitchEmits>()

const innerValue = ref<SwitchValueType>(props.modelValue)
const input = ref<HTMLInputElement>()
const checked = computed(() => {
    return innerValue.value === props.activeValue
})
const switchValue = () => {
    if (props.disabled) return
    const newValue = checked.value ? props.inactiveValue : props.activeValue
    innerValue.value = newValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
}
onMounted(() => {
  input.value!.checked = checked.value
})
watch(checked, (val) => {
  input.value!.checked = val 
})
watch(() => props.modelValue, (newVal) => {
    innerValue.value = newVal
})
</script>

<style scoped>

</style>