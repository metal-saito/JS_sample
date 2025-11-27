import { ElementType, PropsWithChildren, ReactNode } from 'react'

interface PanelProps extends PropsWithChildren {
  readonly title?: string
  readonly titleAs?: ElementType
  readonly description?: ReactNode
  readonly actions?: ReactNode
  readonly footer?: ReactNode
  readonly className?: string
  readonly id?: string
}

export const Panel = ({
  title,
  titleAs: TitleTag = 'h2',
  description,
  actions,
  footer,
  className = '',
  id,
  children,
}: PanelProps) => {
  const sectionClassName = ['panel', className].filter(Boolean).join(' ')
  const hasHeader = Boolean(title || description || actions)

  const descriptionNode = (() => {
    if (!description) {
      return null
    }

    return typeof description === 'string' ? (
      <p className="panel__description">{description}</p>
    ) : (
      <div className="panel__description">{description}</div>
    )
  })()

  return (
    <section className={sectionClassName} id={id}>
      {hasHeader ? (
        <header className="panel__header">
          <div className="panel__heading">
            {title ? <TitleTag className="panel__title">{title}</TitleTag> : null}
            {descriptionNode}
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="panel__body">{children}</div>
      {footer ? <footer className="panel__footer">{footer}</footer> : null}
    </section>
  )
}
