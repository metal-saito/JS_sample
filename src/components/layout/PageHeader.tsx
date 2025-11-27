import { ReactNode } from 'react'

interface PageHeaderProps {
  readonly title: string
  readonly description: ReactNode
  readonly actions?: ReactNode
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  const renderedDescription =
    typeof description === 'string' ? <p>{description}</p> : description

  return (
    <header className="page__header">
      <div>
        <h1>{title}</h1>
        {renderedDescription}
      </div>
      {actions ? <div>{actions}</div> : null}
    </header>
  )
}
