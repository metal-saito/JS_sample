import { ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'medium' | 'small'

const buttonVariantClassName: Record<ButtonVariant, string> = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  ghost: 'button--ghost',
}

const buttonSizeClassName: Record<ButtonSize, string> = {
  medium: 'button--medium',
  small: 'button--small',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant = 'primary', size = 'medium', type, ...rest },
  ref,
) {
  const variantClass = buttonVariantClassName[variant]
  const sizeClass = buttonSizeClassName[size]
  const composedClassName = ['button', variantClass, sizeClass, className].filter(Boolean).join(' ')
  const buttonType = type ?? 'button'

  return <button ref={ref} className={composedClassName} type={buttonType} {...rest} />
})

Button.displayName = 'Button'
