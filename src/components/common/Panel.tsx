import { ElementType, PropsWithChildren } from 'react'

interface PanelProps extends PropsWithChildren {
  readonly title?: string
  readonly titleAs?: ElementType
  readonly className?: string
}

export const Panel = ({
  title,
  titleAs: TitleTag = 'h2',
  className = '',
  children,
}: PanelProps) => {
  const sectionClassName = ['panel', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName}>
      {title ? <TitleTag className="panel__title">{title}</TitleTag> : null}
      {children}
    </section>
  )
}
