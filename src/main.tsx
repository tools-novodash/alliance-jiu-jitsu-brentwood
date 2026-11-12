import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { BookingProvider, BookPage } from './nd'
import { routeOf, ROUTES } from './routes'
import './index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Every route is prerendered (dist/<route>/index.html) and hydrated here; /book is the kit's booking
// page alone, rendered from scratch in its empty shell. An unknown path renders the home page.
const root = document.getElementById('root')!
const path = location.pathname.replace(/\/$/, '') || '/'
const isBook = path === '/book'
const route = routeOf(path) ?? ROUTES[0]
const app = isBook
  ? <StrictMode><BookPage /></StrictMode>
  : <StrictMode><BookingProvider><App route={route} /></BookingProvider></StrictMode>
if (root.firstElementChild && !isBook && routeOf(path)) hydrateRoot(root, app)
else { root.textContent = ''; createRoot(root).render(app) }
