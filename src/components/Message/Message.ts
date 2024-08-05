import type { createMessageProps, MessageContext } from './types'
import { render, h, shallowReactive } from 'vue'
import Message from './Message.vue'
import useZIndex from '@/hooks/useZindex'
let seed = 1
const instances: MessageContext[] = shallowReactive([])
export const createMessage = (props: createMessageProps) => {
  console.log(props)
  const { nextZIndex } = useZIndex()
  const id = `message_${seed++}`
  const div = document.createElement('div')
  const destroy = () => {
    const idx = instances.findIndex((instance) => instance.id === id)
    if (idx === -1) return
    instances.splice(idx, 1)
    render(null, div)
  }
  const manualDestroy = () => {
    const instance = instances.find((instance) => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false
    }
  }
  const newProps = {
    ...props,
    id,
    destroy,
    zIndex: nextZIndex()
  }
  console.log(newProps)
  const vnode = h(Message, newProps)
  render(vnode, div)
  document.body.appendChild(div.firstElementChild!) // 非空断言
  const vm = vnode.component!
  const instance = {
    id,
    vnode,
    props: newProps,
    vm,
    close: manualDestroy
  }
  instances.push(instance)
  return instance
}

export const getLastInstance = () => {
  return instances[instances.length - 1]
}

export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex((instances) => instances.id === id)
  if (idx <= 0) {
    return 0
  } else {
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}
