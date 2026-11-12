# Alliance Jiu Jitsu Brentwood: FIM (ETAPA 3), 12/11/2026

Sem git no projeto: nenhuma fase foi commitada (commit, push e deploy só com o OK do Adryan).

## Números (Lighthouse mobile, build de produção, preview local)
| | Antes (1 rodada) | Depois (mediana de 3) |
|---|---|---|
| Performance | 65 | **82** (rodadas 82, 82, 83; com Pixel e GA4 adiados) |
| SEO | 69 | 69 (é o noindex do modo preview; sobe sozinho com o domínio) |
| LCP | 5,3 s | **2,1 s** |
| CLS | 0 | 0 |
| TBT | 530 ms | 642 ms (os scripts do Pixel e do GA4 ainda rodam dentro da janela medida) |
| Peso da página | 795 KB | 795 KB |
| `dist` | 4,5 MB | 2,5 MB |

**Pixel e GA4 adiados (OK do Adryan, 12/11):** as filas `fbq` e `gtag` nascem na hora (PageView e eventos do formulário ficam guardados) e os scripts carregam logo depois do primeiro paint (~0,3 s no aparelho real), no primeiro toque/scroll ou em 2,5 s no máximo. Conferido no Lighthouse: PageView do Pixel e collect do GA4 disparam. O robô de padrões pode regenerar o bloco `nd:tracking` e desfazer o adiamento.

**Antes do adiamento:** o Pixel (953082716931633) e o GA4 (G-G44P8L78RB) carregam junto com a página. Teste A/B com os IDs em branco no mesmo build: **Perf 95, LCP 2,1 s, TBT 230 ms**. Pela decisão de 28/10 eles ficam no carregamento; adiá-los (fila criada na hora, scripts depois do primeiro paint) precisa do OK do Adryan.

## Responsivo
14/14 viewports OK (`.responsive-check/report.md`), referência 2560×1080. Revisão visual das 3 referências sem pendência.
Corrigido: dois falsos positivos do script (o rótulo `.sr` da conversa virou `role="group"` + `aria-label`; as marcas do bloco amarelo viraram `div`).

## Feito por fase
- **Código morto:** botão secundário sem uso, review e encaixes de família sem uso, fonte Marker, 4 pacotes de fonte (os arquivos ficam em `public/fonts`), 55 imagens geradas que a página não usa. Atenção: `npm run images` regenera todas; depois dele, rodar a limpeza de órfãs de novo ou ignorar (não pesa na página, só no `dist`).
- **.gitignore:** já cobria dist, env, .claude, .responsive-check e reference.
- **SEO:** 1 H1, `lang="en"`, title e description com marca, cidade e serviço, OG/Twitter, JSON-LD (SportsActivityLocation, Person, FAQPage), canonical, sitemap, robots, llms.txt, favicon, apple-touch, theme-color. Em modo preview (sem `VITE_SITE_URL`) tudo sai `noindex` e o robots bloqueia; com o domínio, o pré-render libera os bots de IA sozinho.
- **Preview de link:** `public/og-image.jpg` 1200×630, 89 KB.
- **Performance:** títulos passam a ser divididos (SplitText) só quando chegam perto da tela, em vez de todos na hidratação. Sem efeito medível frente ao peso do Pixel + GA4.
- **Tracking:** kit Novo Dash (UTMs e click IDs capturados e enviados ao GHL pelo kit; Pixel e GA4 do CRM).

## Checklist pós-deploy (gestor)
- [ ] `curl -s -A "WhatsApp/2.23" https://DOMINIO/ | grep -i "og:"` e o mesmo com `Slackbot-LinkExpanding 1.0`.
- [ ] `curl -sI https://DOMINIO/og-image.jpg` → 200, image/jpeg, ≤ 300 KB.
- [ ] Facebook Sharing Debugger, LinkedIn Post Inspector, opengraph.xyz.
- [ ] `curl -s https://DOMINIO/ | grep -i "<h1"` (conteúdo no HTML estático).
- [ ] Hospedagem não bloqueia bots de IA.
- [ ] validator.schema.org e Rich Results Test.
- [ ] Sitemap no Search Console e no Bing Webmaster Tools.
- [ ] Google Business Profile com NAP idêntico ao da página.
- [ ] PageSpeed Insights na URL de produção (mobile).
- [ ] No máximo 1 redirect na URL do anúncio.
- [ ] Abrir a URL do anúncio com UTMs, enviar o formulário, confirmar o lead no GHL com origem e a conversão disparando uma vez.
- [ ] Baseline de IA (ChatGPT, Gemini, Perplexity): "best jiu-jitsu gym in Brentwood CA" e "Alliance Jiu Jitsu Brentwood".

## FIM 2 (12/11/2026, à tarde, depois da rodada de ajustes)
| | FIM 1 | FIM 2 (mediana de 3) |
|---|---|---|
| Performance | 82 | **84** (84, 84, 83) |
| SEO | 69 | 69 (noindex do modo preview) |
| LCP | 2,1 s | 2,3 s (o hero no celular agora tem foto vertical própria, com preload só dela) |
| CLS | 0 | 0 |
| TBT | 642 ms | 570 ms |
| Peso da página | 795 KB | 820 KB |
| `dist` | 2,5 MB | 3,7 MB (os 4 retratos dos coaches e o recorte coach + aluno do Adryan, ~1,2 MB, copiados sem recompressão de propósito; carregam com lazy) |

- Código morto: nada novo (o knip só acusa a API do kit Novo Dash, `entry-server`, `seo.ts`, `api/capi.ts` e o Playwright do teste, todos em uso). Nenhuma imagem órfã.
- Responsivo: 14/14 OK. A revisão das 3 referências achou os pontinhos de "digitando" do chat visíveis ao lado das respostas já dadas; corrigido.
- Corrigido nesta rodada: o cinto (Your first class) travava antes da hora, por cima da agenda, quando a página crescia depois do load (imagens lazy, títulos). Agora os pins se recalculam quando a altura da página muda.
- Pendência opcional: `coach-kid.webp` (368 KB, 1122 px) poderia ganhar uma versão de celular; não feito porque recomprimir recorte já borrou antes (Cristyan).

## Dúvidas e pendências do FIM
- Para passar de 90: o que resta é o TBT do Pixel + GA4 rodando a ~1,7 s simulados. Adiar mais (para depois do load ou só na interação) perde quem sai muito rápido; não feito.
- Domínio (`VITE_SITE_URL`): sem ele o build sai noindex.
- Demais pendências do cliente: `public/memory/briefing.md`.
