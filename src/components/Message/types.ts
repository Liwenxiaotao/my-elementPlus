import type { VNode, ComponentInternalInstance } from 'vue'

export interface MessageProps {
  message?: string | VNode
  duration?: number
  showClose?: boolean
  type?: 'success' | 'danger' | 'warning' | 'info'
  destroy: () => void
  offset?: number
  id: string
  zIndex: number
  transitionName?: string
}

export interface MessageContext {
  id: string
  vnode: VNode
  vm: ComponentInternalInstance
  props: MessageProps
  close: () => void
}
export type createMessageProps = Omit<MessageProps, 'destroy' | 'id' | 'zIndex'>
