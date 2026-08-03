# Wild Side — Wild Rift Companion App

Aplicación estática (offline-first) para la comunidad **Wild Side** de *Wild Rift*. Guía del meta, parches, calendario de eventos y sistema de puntos.

## Características

- **Offline-First**: los datos se almacenan en `localStorage` (sin backend)
- **Auto-actualización**: `scripts/update-data.cjs` sincroniza datos desde Riot Data Dragon
- **Sistema de Puntos**: retos, recompensas, redenciones y leaderboard
- **Meta Content**: tier lists de campeones, items, runas y builds
- **Actualizaciones & Calendario**: historial de parches y eventos
- **Panel Admin**: CRUD completo de todos los contenidos

## Stack

React 19 · TypeScript · Vite 7 · Tailwind 4 · Radix UI · wouter · Zod

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # Verificación de tipos
npm run build      # Build → dist/public/
```

Login admin: `admin` / `admin`

## Actualizar datos (Riot Data Dragon)

```bash
node scripts/update-data.cjs
```

Genera `public/data.json` con nueva versión `YYYY-MM-DD-HH`. La app detecta el cambio y refresca los datos automáticamente.

## Deploy

Vercel (auto-deploy desde la rama `main`):

```bash
vercel deploy --prod
```

URL: https://wild-rift-two.vercel.app

## Especificación (Spec Kit)

Los documentos de especificación viven en `.specify/memory/` (constitution, spec, plan, data-model, tasks, contracts).
