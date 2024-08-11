import type { InjectionKey } from 'vue'
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemProps {
  label?: string
  prop?: string
}
export interface FormItemRule extends RuleItem {
  trigger?: string
}
export interface FormProps {
  model: Record<string, any>
  rules?: Record<string, FormItemRule[]>
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export interface FormValidateFailure {
  errors: ValidateError[]
  fields?: ValidateFieldsError
}

export interface FormItemContext {
  prop: string
  validate: (trigger?: string) => Promise<any>
  resetField: () => void
  clearValidate: () => void
}
export interface FormInstance {
  validate: () => Promise<any>
  clearValidate: (props?: string[]) => void
  resetFields: (props?: string[]) => void
}

export interface ValidateStatusProps {
  state: 'init' | 'success' | 'error'
  errorMessage: string
  loading: boolean
}

export interface FormItemInstance {
  validateState: ValidateStatusProps
  validate: (trigger?: string) => Promise<any>
  resetField: () => void
  clearValidate: () => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContext')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContext')
