import { defineComponent } from "vue";
import type {PropType} from 'vue'
import type { Placement, Options } from "@popperjs/core";
import type {MenuOption} from './types'
import ToolTip from '../ToolTip/ToolTip.vue';

export default defineComponent({
    name: 'VkDropdown',
    props: {
        placement: {
          type: String as PropType<Placement>,
          default: 'bottom'
        },
        trigger: {
          type: String as PropType<'hover' | 'click'>,
          default: 'hover'
        },
        transition: {
          type: String,
          default: 'fade'
        },
        openDelay: {
          type: Number,
          default: 0
        },
        closeDelay: {
          type: Number,
          default: 0,
        },
        popperOptions: {
          type: Object as PropType<Options>,
        },
        menuOptions: {
          type: Array as PropType<MenuOption[]>,
          required: true
        },
        hideAfterClick: {
          type: Boolean,
          default: true
        },
        manual: {
          type: Boolean
        }
    },
    setup(props, {slots}) {
        return () => (
            <div class="vk-dropdown">
                <ToolTip
                    trigger={props.trigger}
                    placement={props.placement}
                    popperOptions={props.popperOptions}
                    openDelay={props.openDelay}
                    closeDelay={props.closeDelay}>
                        {{
                            default: () => slots.default && slots.default()
                        }}
                </ToolTip>
            </div>
        )
    }
})