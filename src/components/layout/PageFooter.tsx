import { PropsWithChildren } from 'react'

export const PageFooter = ({ children }: PropsWithChildren) => {
  return <footer className="page__footer">{children}</footer>
}
