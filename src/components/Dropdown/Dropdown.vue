<template>
  <div class="vk-dropdown">
    <ToolTip
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      @visible-change="visibleChange"
      ref="tooltipRef"
    >
      <slot></slot>
      <template #content>
        <ul class="vk-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li v-if="item.divided" role="separator" class="divided-placeholder"></li>
            <li
              class="vk-dropdown__item"
              :class="{
                'is-disabled': item.disabled,
                'is-divided': item.divided
              }"
              :id="`dropdown-item-${item.key}`"
              @click="itemClick(item)"
            >
              <RenderVnode :v-node="item.label"></RenderVnode>
            </li>
          </template>
        </ul>
      </template>
    </ToolTip>
  </div>
</template>

<script setup lang="ts">
import type { DropdownProps, MenuOption, DropdownEmits, DropdownInstance } from './types'
import ToolTip from '../ToolTip/ToolTip.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ToolTipInstance } from '../ToolTip/types'
import RenderVnode from '../Common/RenderVnode'
defineOptions({
  name: 'VkDropdown'
})

const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true
})
const emits = defineEmits<DropdownEmits>()
const tooltipRef = ref() as Ref<ToolTipInstance>
const visibleChange = (e: boolean) => {
  emits('visible-change', e)
}
const itemClick = (e: MenuOption) => {
  if (e.disabled) return
  emits('select', e)
  if (props.hideAfterClick) {
    tooltipRef.value.hide()
  }
}
defineExpose<DropdownInstance>({
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide()
})
</script>

<style scoped></style>
