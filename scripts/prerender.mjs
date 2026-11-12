// ─────────────────────────────────────────────────────────────────────────────
// prerender.mjs: after `vite build` and the SSR build of src/entry-server.tsx. Every route of
// src/routes.tsx becomes dist/<route>/index.html: the page rendered, its own <title>, description,
// canonical, Open Graph and JSON-LD, the stylesheet inline, the LCP photo preloaded, the bundle
// started after that photo is painted. The browser hydrates each page (src/main.tsx).
// • /book: an empty shell the browser renders (the Novo Dash kit's booking page).
// • Tracking and the booking form are the kit's (src/nd + its nd:tracking block in index.html).
// • robots.txt, sitemap.xml, llms.txt. While no domain is confirmed (VITE_SITE_URL): noindex.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const must = (cond, what) => { if (!cond) throw new Error(`prerender: ${what}`) }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const write = (rel, s) => { const f = path.join(dist, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s) }
const EMPTY_ROOT = '<div id="root"></div>'

process.env.NODE_ENV ??= 'production'
// The kit keeps a module-level reference to `window`: a stub for the render only (no effect runs here).
globalThis.window ??= { location: { search: '', hash: '', pathname: '/', href: '' } }
const ssr = await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href)
const { ROUTES, render, jsonLd, llms } = ssr
const SITE = (process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4320')).replace(/\/$/, '')
const PREVIEW = !process.env.VITE_SITE_URL

// the stylesheet inline (one round trip less before the first paint; its URLs are absolute)
let tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const cssLink = tpl.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/)
must(cssLink, 'the stylesheet link')
const css = fs.readFileSync(path.join(dist, cssLink[1]), 'utf8')
must(!/url\((?!["']?(\/|data:|#))/.test(css), 'only absolute URLs in the CSS')
tpl = tpl.replace(cssLink[0], `<style>${css}</style>`)
must(tpl.includes(EMPTY_ROOT) && tpl.includes('<!--cr:head-->'), 'the template markers')

// the entry starts after the LCP photo is painted: the browser's own largest-contentful-paint entry for an
// image where it exists (Chromium), else after the photo decodes and a frame passes (2.5 s ceiling)
const deferEntry = (html) => {
  const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
  must(entry, 'the module entry script')
  const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1])
  const loader = `<script>(function(){var d=0;function go(){if(d)return;d=1;${JSON.stringify(preloads)}.forEach(function(h){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.appendChild(l)});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(entry[1])};document.head.appendChild(s)}function later(){requestAnimationFrame(function(){setTimeout(go,300)})}var p=document.querySelector('link[rel=preload][as=image]');var ty=typeof PerformanceObserver!=='undefined'&&PerformanceObserver.supportedEntryTypes||[];if(p&&ty.indexOf('largest-contentful-paint')>-1){new PerformanceObserver(function(l,o){l.getEntries().forEach(function(e){if(e.element&&e.element.tagName==='IMG'){o.disconnect();later()}})}).observe({type:'largest-contentful-paint',buffered:true})}else if(!p)later();else{var i=new Image();if(p.imageSrcset){i.sizes=p.imageSizes||'';i.srcset=p.imageSrcset}else{i.src=p.href}(i.decode?i.decode():Promise.resolve()).then(later,later)}setTimeout(go,2500)})()</script>`
  return html.replace(entry[0], '').replace(/\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, '').replace('</body>', `${loader}\n</body>`)
}

const og = `${SITE}/og-image.jpg`
const headFor = (r, lcp) => `<meta name="robots" content="${PREVIEW ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<link rel="canonical" href="${SITE}${r.path === '/' ? '/' : r.path}">
<meta property="og:type" content="${r.article ? 'article' : 'website'}">
<meta property="og:site_name" content="Alliance Jiu Jitsu Brentwood">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${SITE}${r.path}">
<meta property="og:title" content="${esc(r.title)}">
<meta property="og:description" content="${esc(r.description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:secure_url" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A class at Alliance Jiu Jitsu Brentwood on the mats on Lone Tree Way, Brentwood, CA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(r.title)}">
<meta name="twitter:description" content="${esc(r.description)}">
<meta name="twitter:image" content="${og}">
<meta name="format-detection" content="telephone=no">
${lcp ?? ''}
<script type="application/ld+json">${JSON.stringify(jsonLd(r)).replace(/</g, '\\u003c')}</script>`

const urls = []
for (const r of ROUTES) {
  let html = render(r.path)
  // React 19 emits <link rel="preload" as="image"> for eager images inside #root: the first one goes to the head
  const pre = [...html.matchAll(/<link rel="preload" as="image"[^>]*\/?>/g)].map((m) => m[0])
  html = html.replace(/<link rel="preload" as="image"[^>]*\/?>/g, '')
  must((html.match(/<h1[\s>]/g) ?? []).length === 1, `exactly one <h1> on ${r.path}`)
  // the LCP is the photo marked fetchpriority="high" (the hero), not the first eager image (the nav logo)
  const hi = html.match(/<img[^>]*fetchPriority="high"[^>]*>|<img[^>]*fetchpriority="high"[^>]*>/i)?.[0]
  const hiSrc = hi?.match(/\ssrc="([^"]+)"/)?.[1]
  const pick = (hiSrc && pre.find((l) => l.includes(`"${hiSrc}"`) || l.includes(hiSrc.replace(/\.webp$/, '-sm.webp')))) || pre[0]
  // a hero with a desktop <source> (src/components/sections/Hero.tsx `wide`): React preloads nothing inside a
  // <picture>, so each screen gets its own preload, split by the source's media query
  const pic = hi && html.match(/<picture><source ([^>]*)\/?>(?:(?!<\/picture>).)*fetchPriority="high"/s)
  const at = (tag, a) => ` ${tag}`.match(new RegExp(`\\s${a}="([^"]+)"`, 'i'))?.[1]
  const lcp = pic
    ? [[pic[1], at(pic[1], 'media')], [hi, `not all and ${at(pic[1], 'media')}`]].map(([t, m]) => `<link rel="preload" as="image" imagesrcset="${at(t, 'srcSet') ?? at(t, 'src')}" imagesizes="${at(t, 'sizes') ?? '100vw'}" media="${m}" fetchpriority="high">`).join('\n')
    : pick?.replace(/\/?>$/, ' fetchpriority="high">')
  const page = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(r.description)}" />`)
    .replace('<!--cr:head-->', headFor(r, lcp))
    .replace(EMPTY_ROOT, `<div id="root">${html}</div>`)
  write(r.path === '/' ? 'index.html' : `${r.path.slice(1)}/index.html`, deferEntry(page))
  urls.push({ loc: `${SITE}${r.path === '/' ? '/' : r.path}`, lastmod: r.article?.date ?? new Date().toISOString().slice(0, 10) })
}

// /book: the kit's booking page, rendered in the browser; never indexed
write('book/index.html', deferEntry(tpl.replace(/<title>[^<]*<\/title>/, '<title>Book a free trial class | Alliance Jiu Jitsu Brentwood</title>').replace('<!--cr:head-->', `<meta name="robots" content="noindex, nofollow">\n<link rel="canonical" href="${SITE}/book">`)))

write('robots.txt', PREVIEW
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nDisallow: /book\n\n${['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended', 'Bingbot'].map((b) => `User-agent: ${b}\nAllow: /`).join('\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`)
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`)
write('llms.txt', llms())

fs.rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
fs.rmSync(path.join(dist, 'memory'), { recursive: true, force: true })
console.log(`prerender: ${ROUTES.length} pages + /book${PREVIEW ? ' · PREVIEW (noindex) at ' + SITE : ' · ' + SITE}`)
