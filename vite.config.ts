import { defineConfig, type Connect, type Plugin, type ViteDevServer, type PreviewServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// The domain: VITE_SITE_URL once the client confirms it (public/memory/briefing.md); until then the
// Vercel production URL, and the build is a client preview (noindex, see scripts/prerender.mjs).
const confirmed = process.env.VITE_SITE_URL?.replace(/\/$/, '')
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4173'

// Local /api: the kit's CAPI handler (api/capi.ts) answers in dev and preview as on Vercel.
type Load = (url: string) => Promise<Record<string, unknown>>
const apiMiddleware = (load: Load): Connect.NextHandleFunction => async (req, res, next) => {
  const m = req.url?.match(/^\/api\/(capi)(\?.*)?$/)
  if (!m) return next()
  let raw = ''
  for await (const chunk of req) raw += chunk
  const mod = await load(`/api/${m[1]}.ts`)
  const handler = mod.default as (q: unknown, s: unknown) => Promise<void>
  await handler({ method: req.method, body: raw ? JSON.parse(raw) : {}, headers: req.headers }, {
    status: (code: number) => ({ json: (b: unknown) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(b)) } }),
  })
}
let ssrForPreview: ViteDevServer | null = null
const localApi = (): Plugin => ({
  name: 'local-api',
  configureServer(server) { server.middlewares.use(apiMiddleware((u) => server.ssrLoadModule(u))) },
  configurePreviewServer(server: PreviewServer) {
    // serve each prerendered route's own HTML (dist/<route>/index.html), as Vercel does; vite preview
    // alone answers every route with the home page and the hydration breaks
    server.middlewares.use((req, res, next) => {
      const u = decodeURIComponent((req.url ?? '/').split('?')[0]).replace(/\/$/, '')
      const f = path.join(process.cwd(), 'dist', u, 'index.html')
      if (u && !path.extname(u) && fs.existsSync(f)) { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(fs.readFileSync(f)); return }
      next()
    })
    server.middlewares.use(apiMiddleware(async (u) => {
      ssrForPreview ??= await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
      return ssrForPreview.ssrLoadModule(u)
    }))
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
  define: { __SITE__: JSON.stringify(confirmed || vercelUrl), __PREVIEW__: JSON.stringify(!confirmed) },
  server: { port: 5320, fs: { deny: ['reference/**', '.env', '.env.*'] } },
  preview: { port: 4320 },
  build: { sourcemap: !!process.env.SOURCEMAP },
})
