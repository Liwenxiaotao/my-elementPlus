import { onBeforeMount, onMounted, isRef, watch, unref } from 'vue'
import type { Ref } from 'vue'

export default function useEventListener(
  target: EventTarget | Ref<null | EventTarget>,
  event: string,
  handler: (e: Event) => void
) {
  if (isRef(target)) {
    watch(target, (val, oldVal) => {
      oldVal?.removeEventListener(event, handler)
      val?.addEventListener(event, handler)
    })
  } else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }
  onBeforeMount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}
