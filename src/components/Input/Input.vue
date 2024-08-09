<template>
  <div 
    class="vk-input"
    :class="{
        [`vk-input--${type}`]: type,
        [`vk-input--${size}`]: size,
        'is-disabled': disabled,
        'is-prepend': $slots.prepend,
        'is-append': $slots.append,
        'is-prefix': $slots.prefix,
        'is-suffix': $slots.suffix,
        'is-focus': isFocus
    }"
    @click="keepFocus"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
        <!-- prepend slot -->
         <div v-if="$slots.prepend" class="vk-input__prepend">
            <slot name="prepend"></slot>
         </div>
         <div class="vk-input__wrapper">
            <!-- prefix slot -->
            <div v-if="$slots.prefix" class="vk-input__prefix">
                <slot name="prefix"></slot>
            </div>
            <input
                class="vk-input__inner"
                v-bind="attrs"
                :type="showPassword ? (passwordVisible ? 'text' : 'password') :type"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :autofocus="autofocus"
                :form="form"
                v-model="innerValue"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                ref="inputRef"
            />
            <!-- suffix slot -->
            <div v-if="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix">
                <slot name="suffix"></slot>
                <Icon icon="circle-xmark" v-if="showClear" class="vk-input__clear" @click="clear" @mousedown.prevent="NOOP"></Icon>
                <Icon icon="eye" v-if="showPasswordArea && passwordVisible" class="vk-input__password" @click="togglePasswordVisible"></Icon>
                <Icon icon="eye-slash" v-if="showPasswordArea && !passwordVisible" class="vk-input__password"  @click="togglePasswordVisible"></Icon>
            </div>
         </div>
        <!-- append slot -->
        <div v-if="$slots.append" class="vk-input__append">
            <slot name="append"></slot>
         </div>
    </template>
    <!-- textarae -->
    <template v-else>
        <textarea
            class="vk-textarea__wrapper"
            v-bind="attrs"
            :disabled="disabled"
            :placeholder="placeholder"
            :readonly="readonly"
            :autocomplete="autocomplete"
            :autofocus="autofocus"
            :form="form"
            v-model="innerValue"
            @input="handleInput"
            @focue="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            ref="inputRef"
        ></textarea>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {Ref} from 'vue'
import type {InputProps, InputEmits} from './types'
import {computed, ref, useAttrs, watch, nextTick} from 'vue'
import Icon from '../Icon/Icon.vue'
defineOptions({
    name: 'VkInput',
    inheritAttrs: false
})

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    autocomplete: 'off'
})
const attrs = useAttrs()
const innerValue = ref(props.modelValue)
const isFocus = ref(false)
const passwordVisible = ref(false)
const inputRef = ref() as Ref<HTMLInputElement>
const showClear = computed(() => {
        return props.clearable &&
        !props.disabled &&
        !! innerValue.value &&
        isFocus.value
    }
)
const showPasswordArea = computed(() => {
    return props.showPassword &&
    !props.disabled &&
    !!innerValue.value
})
const NOOP=() => {}
const emit = defineEmits<InputEmits>()
const handleInput = () => {
    emit('update:modelValue', innerValue.value)
    emit('input', innerValue.value)
}
const handleChange = () => {
    emit('change', innerValue.value)
}
const handleFocus = (event: FocusEvent) => {
    isFocus.value = true
    emit('focus', event)
}
const handleBlur = (event: FocusEvent) => {
    isFocus.value = false
    emit('blur', event)
}
const clear = () => {
    innerValue.value = ''
    emit('update:modelValue', '')
    emit('clear')
    emit('change', '')
    emit('input', '')
}
const togglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value
}
const keepFocus = async() => {
    await nextTick()
    inputRef.value.focus()
}
watch(() => props.modelValue, (newVal) => {
    innerValue.value = newVal
})
defineExpose({
    ref: inputRef
})
</script>

<style scoped>

</style>