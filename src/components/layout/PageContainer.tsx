import { PropsWithChildren } from 'react'

export const PageContainer = ({ children }: PropsWithChildren) => {
  return <div className="page">{children}</div>
}
