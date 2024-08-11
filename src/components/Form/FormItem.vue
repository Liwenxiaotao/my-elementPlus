<template>
  <div
    class="vk-form-item"
    :class="{
      'is-error': validateState.state === 'error',
      'is-success': validateState.state === 'success',
      'is-loading': validateState.loading,
      'is-required': isRequired
    }"
  >
    <label class="vk-form-item__label">
      <slot name="label" :label="label">
        {{ label }}
      </slot>
    </label>
    <div class="vk-form-item__content">
      <slot :validate="validate"></slot>
      <div class="vk-form-item__error-msg" v-if="validateState.state === 'error'">
        {{ validateState.errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, reactive, provide, onMounted, onUnmounted } from 'vue'
import { isNil } from 'lodash-es'
import Schema from 'async-validator'
import { formContextKey, formItemContextKey } from './types'
import type {
  FormItemProps,
  FormValidateFailure,
  FormItemContext,
  FormItemInstance,
  ValidateStatusProps
} from './types'
defineOptions({
  name: 'VkFormItem'
})
const props = defineProps<FormItemProps>()
const formContext = inject(formContextKey)
const validateState = reactive<ValidateStatusProps>({
  state: 'init',
  errorMessage: '',
  loading: false
})
let initialValue: any = null
const innerValue = computed(() => {
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    return model[props.prop]
  }
  return null
})
const innerRules = computed(() => {
  const rules = formContext?.rules
  if (rules && props.prop && rules[props.prop]) {
    return rules[props.prop]
  }
  return []
})
const isRequired = computed(() => {
  return innerRules.value.some((rule) => rule.required)
})
const getTriggeredRules = (trigger?: string) => {
  const rules = innerRules.value
  if (rules) {
    return rules.filter((rule) => {
      if (!rule.trigger || !trigger) return true
      return rule.trigger === trigger
    })
  } else {
    return []
  }
}
const validate = async (trigger?: string) => {
  const modelName = props.prop
  const triggeredRules = getTriggeredRules(trigger)
  if (triggeredRules.length === 0) return true
  if (modelName) {
    const validator = new Schema({
      [modelName]: triggeredRules
    })
    validateState.loading = true
    return validator
      .validate({ [modelName]: innerValue.value })
      .then(() => {
        validateState.state = 'success'
      })
      .catch((e: FormValidateFailure) => {
        const { errors } = e
        validateState.state = 'error'
        validateState.errorMessage = errors && errors.length > 0 ? errors[0].message || '' : ''
        console.log(e.fields)
        return Promise.reject(e)
      })
      .finally(() => {
        validateState.loading = false
      })
  }
}
const clearValidate = () => {
  validateState.state = 'init'
  validateState.errorMessage = ''
  validateState.loading = false
}
const resetField = () => {
  clearValidate()
  const model = formContext?.model
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue
  }
}
const context: FormItemContext = {
  prop: props.prop || '',
  validate,
  resetField,
  clearValidate
}
provide(formItemContextKey, context)
onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    initialValue = innerValue.value
  }
})
onUnmounted(() => {
  formContext?.removeField(context)
})
defineExpose<FormItemInstance>({
  validate,
  clearValidate,
  resetField,
  validateState
})
</script>

<style scoped></style>
