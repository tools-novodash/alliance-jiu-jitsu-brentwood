/** Server entry for the prerender (scripts/prerender.mjs), built with `vite build --ssr`: renders each
 *  route to static HTML for crawlers, AI bots and link previews; the browser hydrates it. */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { BookingProvider } from './nd'
import { ROUTES, routeOf } from './routes'

export { ROUTES }
export { jsonLd, llms } from './seo'
export const render = (path: string) => renderToString(
  <StrictMode><BookingProvider><App route={routeOf(path)!} /></BookingProvider></StrictMode>,
)
