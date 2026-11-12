import type { ReactNode } from 'react'
import { Home } from './pages/Home'

export type Route = { path: string; title: string; description: string; page: () => ReactNode }

/** One landing page (Adryan, 11/11) plus the kit's /book, which is not a route of the app. */
export const ROUTES: Route[] = [
  {
    path: '/',
    title: 'Jiu Jitsu in Brentwood, CA for Kids and Adults | Alliance Jiu Jitsu Brentwood',
    description: 'Alliance Jiu Jitsu on Lone Tree Way, Brentwood: kids classes from age 5, adult Fundamentals for beginners, 38 classes a week. Your first class is free.',
    page: () => <Home />,
  },
]

export const routeOf = (path: string) => ROUTES.find((r) => r.path === (path.replace(/\/$/, '') || '/'))
