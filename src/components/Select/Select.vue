<template>
  <div
    class="vk-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <ToolTip
      ref="toolTipRef"
      placement="bottom-start"
      manual
      :popperOptions="popperOptions"
      @click-outside="controlDropdown(false)"
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filteredPlaceholder"
        ref="inputRef"
        :readonly="!filterable || !isDropdowmShow"
        @input="debounceOnFilter"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            v-if="showClearIcon"
            class="vk-input__clear"
            @mousedown.prevent="Noop"
            @click.stop="onClear"
          >
          </Icon>
          <Icon
            v-else
            icon="angle-down"
            class="header-angle"
            :class="{ 'is-active': isDropdowmShow }"
          ></Icon>
        </template>
      </Input>
      <template #content>
        <div class="vk-select__loading" v-if="states.loading">
          <Icon icon="spinner" spin></Icon>
        </div>
        <div class="vk-select__nodata" v-else-if="filterable && filterOptions.length === 0">
          no matched data
        </div>
        <ul v-else class="vk-select__menu">
          <template v-for="(item, index) in filterOptions" :key="index">
            <li
              class="vk-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === index
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label"></RenderVnode>
            </li>
          </template>
        </ul>
      </template>
    </ToolTip>
  </div>
</template>

<script setup lang="ts">
import type { SelectEmits, SelectProps, SelectOption, SelectState } from './types'
import type { ToolTipInstance } from '../ToolTip/types'
import type { Ref } from 'vue'
import { isFunction, debounce } from 'lodash-es'
import type { InputInstance } from '../Input/types'
import ToolTip from '../ToolTip/ToolTip.vue'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import { reactive, ref, computed, watch } from 'vue'
import RenderVnode from '../Common/RenderVnode'
const finfOption = (value: string) => {
  const option = props.options.find((option) => option.value === value)
  return option ? option : null
}
defineOptions({
  name: 'VkSelect'
})
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})
const emit = defineEmits<SelectEmits>()
const initialOption = finfOption(props.modelValue)
const toolTipRef = ref() as Ref<ToolTipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectState>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1
})
const isDropdowmShow = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }
    },
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`
      },
      phase: 'beforeWrite',
      requires: ['computeStyles']
    }
  ]
}
const filterOptions = ref(props.options)
const timeout = computed(() => (props.remote ? 300 : 0))
const showClearIcon = computed(() => {
  return (
    props.clearable && states.mouseHover && states.selectedOption && states.inputValue.trim() !== ''
  )
})
watch(
  () => props.options,
  (newVal) => {
    filterOptions.value = newVal
  }
)
const Noop = () => {}
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emit('clear')
  emit('change', '')
  emit('update:modelValue', '')
}
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdowmShow.value) {
        controlDropdown(true)
      } else if (states.highlightIndex > -1 && filterOptions.value[states.highlightIndex]) {
        itemSelect(filterOptions.value[states.highlightIndex])
      } else {
        controlDropdown(false)
      }
      break
    case 'Escape':
      if (isDropdowmShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (filterOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filterOptions.value.length - 1
        } else {
          states.highlightIndex--
        }
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      if (filterOptions.value.length > 0) {
        if (
          states.highlightIndex === -1 ||
          states.highlightIndex === filterOptions.value.length - 1
        ) {
          states.highlightIndex = 0
        } else {
          states.highlightIndex++
        }
      }
      break
    default:
      break
  }
}
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filterOptions.value = props.filterMethod(searchValue)
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true
    try {
      filterOptions.value = await props.remoteMethod(searchValue)
    } catch (e) {
      console.log(e)
      filterOptions.value = []
    } finally {
      states.loading = false
    }
  } else {
    filterOptions.value = props.options.filter((option) => option.label.includes(searchValue))
  }
  states.highlightIndex = -1
}
const onFilter = () => {
  generateFilterOptions(states.inputValue)
}
const debounceOnFilter = debounce(() => {
  onFilter()
}, timeout.value)
const filteredPlaceholder = computed(() => {
  return props.filterable && states.selectedOption && isDropdowmShow.value
    ? states.selectedOption.label
    : props.placeholder
})
const controlDropdown = (show: boolean) => {
  if (show) {
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    if (props.filterable) {
      generateFilterOptions(states.inputValue)
    }
    toolTipRef.value.show()
  } else {
    toolTipRef.value.hide()
    if (props.filterable) {
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
    }
    states.highlightIndex = -1
  }
  isDropdowmShow.value = show
  emit('visible-change', show)
}
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdowmShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emit('change', e.value)
  emit('update:modelValue', e.value)
  controlDropdown(false)
  inputRef.value.ref.focus()
}
</script>

<style scoped></style>
