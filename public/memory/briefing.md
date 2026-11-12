# Alliance Jiu Jitsu Brentwood: pendências do cliente (11/11/2026)

LP de uma página + `/book` (kit Novo Dash). Dev: `alliance-dev` (porta 5320) no `.claude/launch.json` da pasta NovoDash.
Fonte de todos os fatos: o site atual (`reference/current-site/levantamento.md`). Nada inventado; o que falta está abaixo.

## Travam a publicação
1. **Domínio** (`VITE_SITE_URL`). Sem ele o build sai `noindex` (modo preview). O site atual também está `noindex`.
2. **Preços**: mensalidade, taxa de matrícula, plano de família, contrato e regra de cancelamento. Hoje a página não fala de preço (a FAQ de preço ficou de fora).
3. **Autorização de uso das fotos com crianças**: as do site atual e, desde 12/11, duas do Instagram (laço de faixa e pulo de sapo); as faixas do Rhett e do Paul saíram da página em 12/11.
4. **Turmas do GHL x nomes do site**: o formulário puxa do GHL "Adults BJJ All Levels", "Kids BJJ 5-7", "Kids BJJ 8-10", "Teens BJJ 11-14". O site chama de Fundamentals/Intermediate, Little Eagles, Eagle Warrior e Eagle Youth (11 a 13, não 14). Confirmar a idade do Teens e, se quiserem, renomear por `programOverrides` no `src/nd/client.ts`.

## Melhoram a página (seções prontas para receber)
5. **Reviews do Google** (nota e número) ou depoimentos reais: um adulto que começou do zero e um faixa preta de fora. O review da mãe (Instagram) saiu da página em 12/11 (seção de pais virou boletim); se voltar, precisa de autorização e nome do autor.
5b. **Segunda professora**: o review fala em duas coaches mulheres; o site só tem a Abby. Nome, faixa e foto dela.
5c. **Oferta de matrícula**: o Instagram teve "Save $160 + free uniform" até 20/8. Existe taxa de matrícula? Vai ter oferta parecida na campanha?
6. **Faixa marrom da Abby**: foi dada pelo Ricardo? Se sim, o título dos coaches passa a "Three of them got their belts from Ricardo".
7. **Estacionamento** em 6730 Lone Tree Way (pergunta comum de pais).
8. **Gi emprestado na aula grátis?** Hoje a página só diz que não precisa comprar nada.
9. **Little Eagles no sábado**: 9 a 10 (60 min) ou 45 min como nos outros dias? E a home antiga diz "every weekday afternoon" enquanto a página do programa conta 8 aulas.
10. **No Gi** (quarta 7 PM): idade e pré-requisito (aparece só na grade antiga).
11. **Fotos melhores do Ricardo** (só há o retrato de fundo verde) e uma foto de família treinando junto, para o hero de celular.
12. Vídeo curto de uma aula comum, se existir.

## Tracking (kit)
- Pixel `953082716931633` e GA4 `G-G44P8L78RB` vêm do CRM. Google Ads e Clarity vazios.
- Webhook do GHL configurado (`ghl.locationId` / `leadWebhookUuid` do CRM). Não testei envio de lead real.

## O que ficou sem teste
- Lighthouse e o finalizador (FIM) não foram rodados.
- Conferi uma vez em 1536x864 e em 375x812 (celular). Tablet e ultrawide não conferidos.
- Movimento reduzido não conferido.
