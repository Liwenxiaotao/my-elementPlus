import type { Ref, InjectionKey } from 'vue'

export interface CollapseItemProps {
  name: NameType
  title?: string
  disabled?: boolean
}

export interface CollapseProps {
  accordion?: boolean
}

export type NameType = string | number

export interface CollapseContext {
  activeNames: Ref<NameType[]>
  handleItemClick: (name: NameType) => void
}

export interface CollapseEmits {
  (e: 'change', value: NameType[]): void
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('CollapseContext')
