import { PropsWithChildren, ReactNode } from 'react'

export interface EmptyStateProps extends PropsWithChildren {
  readonly title: string
  readonly description?: ReactNode
  readonly icon?: ReactNode
  readonly actions?: ReactNode
  readonly className?: string
}

const renderDescription = (description: ReactNode) => {
  if (!description) {
    return null
  }

  if (typeof description === 'string') {
    return <p className="empty-state__description">{description}</p>
  }

  return <div className="empty-state__description">{description}</div>
}

export const EmptyState = ({
  title,
  description,
  icon,
  actions,
  className = '',
  children,
}: EmptyStateProps) => {
  const containerClassName = ['empty-state', className].filter(Boolean).join(' ')
  const descriptionNode = renderDescription(description)

  return (
    <div className={containerClassName}>
      <div className="empty-state__content">
        {icon ? <div className="empty-state__icon" aria-hidden="true">{icon}</div> : null}
        <h3 className="empty-state__title">{title}</h3>
        {descriptionNode}
        {children ? <div className="empty-state__extra">{children}</div> : null}
        {actions ? <div className="empty-state__actions">{actions}</div> : null}
      </div>
    </div>
  )
}
