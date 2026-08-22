# 🏁 Paddock — site de F1 para fãs

Site feito com Next.js para acompanhar Fórmula 1: classificação do campeonato, corrida
ao vivo, rádio de equipe e uma página completa por piloto — tudo com dados reais e
gratuitos, sem chave de API.

## Fontes de dados

- **[OpenF1](https://openf1.org)** — telemetria e dados de sessão: voltas, posições,
  pit stops, pneus, clima, direção de prova e rádio de equipe (áudio).
- **[Jolpica-F1](https://github.com/jolpica/jolpica-f1)** — sucessora gratuita da Ergast:
  classificação de pilotos e construtores, calendário da temporada.

Nenhuma das duas exige chave de API nem cadastro.

## Páginas

- **`/`** — sessão em destaque (ao vivo durante o fim de semana de corrida), líder do
  campeonato em destaque, campeonato de construtores, classificação da corrida ao vivo,
  rádio da equipe de qualquer piloto, próximo GP, grid completo de pilotos e direção de
  prova.
- **`/classificacao`** — classificação completa do campeonato (pilotos e construtores).
- **`/piloto/[numero]`** — página individual: gráfico de desempenho (posição, ritmo,
  velocidade, com tooltip interativo), estratégia de pneus, pit stops, rádio da equipe,
  tabela de todas as voltas, classificação da sessão e condições da pista. Aceita
  `?session=<session_key>` para ver uma sessão específica em vez da mais recente.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components)
- TypeScript
- Tailwind CSS v4
- [lucide-react](https://lucide.dev) para ícones
- [country-flag-icons](https://www.npmjs.com/package/country-flag-icons) para bandeiras

## Estrutura

```
src/
  lib/
    openf1.ts        — client tipado para a API OpenF1
    jolpica.ts        — client tipado para a API Jolpica-F1 (classificação)
    safeFetch.ts      — diferencia "sem dado" de "falha na requisição"
    teamColors.ts     — casa nome de equipe (Jolpica) com cor real (OpenF1)
    types.ts          — tipos de todos os dados
  components/         — gráficos, cards, listas reutilizadas entre home/piloto
  app/
    page.tsx                  — home
    classificacao/page.tsx    — classificação completa
    piloto/[number]/page.tsx  — página do piloto
```

## Limites da API

O plano gratuito do OpenF1 permite 3 requisições/segundo. Quando isso acontece, o site
não trata a falha como "sem dado" — mostra um aviso específico ("não foi possível
carregar agora, recarregue a página"). As páginas são renderizadas por requisição
(`dynamic = "force-dynamic"`), então um rate limit nunca quebra o build/deploy.

## Créditos

Foto de fundo da página do piloto: *Circuit Zandvoort* por
[dronepicr](https://commons.wikimedia.org/wiki/File:Aerial_view_of_Motorsport_race_track_Circuit_Zandvoort_Formula_one_(40889997713).jpg),
licença CC BY 2.0.

## Deploy na Vercel

```bash
npx vercel
```

Ou conecte o repositório em [vercel.com/new](https://vercel.com/new) — não precisa de
nenhuma variável de ambiente.

## Ideias para evoluir

- Batalhas em tempo real (gap entre pilotos adjacentes na corrida).
- Detecção de ultrapassagens comparando posição volta a volta.
- Comparação lado a lado entre dois pilotos.
- Página de equipe e de circuito.
