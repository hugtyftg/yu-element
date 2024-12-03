import { type Component, type Ref } from 'vue';
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type NativeType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'default' | 'large' | 'small';

export interface ButtonProps {
  tag?: 'button' | 'a' | 'div' | Component;
  nativeType?: NativeType;
  type?: ButtonType;
  size?: ButtonSize;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  icon?: string;
  loading?: boolean;
  loadingIcon?: string;
  useThrottle?: boolean;
  throttleDuration?: number;
}
export interface ButtonGroupProps {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ButtonGroupContext {
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ButtonEmits {
  (event: 'click', val: MouseEvent): void;
}

export interface ButtonExpose {
  ref: Ref<HTMLElement | void>;
}
