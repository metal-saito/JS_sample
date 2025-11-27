import { ReactNode } from 'react'

type FormMessageVariant = 'info' | 'error'

interface FormMessageProps {
  readonly variant: FormMessageVariant
  readonly children: ReactNode
  readonly id?: string
}

const classNameByVariant: Record<FormMessageVariant, string> = {
  info: 'form-helper',
  error: 'error',
}

const isRenderable = (value: ReactNode): value is Exclude<ReactNode, null | undefined | false> =>
  value !== null && value !== undefined && value !== false

export const FormMessage = ({ variant, children, id }: FormMessageProps) => {
  if (!isRenderable(children)) {
    return null
  }

  return (
    <p id={id} className={classNameByVariant[variant]}>
      {children}
    </p>
  )
}
