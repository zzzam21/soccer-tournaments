# Soccer Tournaments — Guía para IA

**Propósito**: Plataforma de gestión de torneos de fútbol.
- **Frontend**: Angular 21 standalone + Signals + NgRx, servido por Nginx.
- **Backend**: Django 5.2 + DRF + PostgreSQL.
- **Deploy**: Docker Compose (`docker-compose.yml`, `compose.override.yml`).

---

## Reglas

1. Branch principal: `main`.
2. Componentes Angular siempre **standalone** + **OnPush**.
3. NgRx para estado global (auth, layout, tournament, team, match).
4. NO editar `frontend/src/client/` (generado automáticamente).
5. Backend Django apps: tournaments, teams, player, match, game, gameEvents.

---

## Comandos de desarrollo

### Backend (Django)
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python initial_data.py
python clear_cache.py
```

### Frontend (Angular)
```bash
cd frontend
npm start          # ng serve (proxy /api → localhost:8000)
npm run build      # build producción
npm run test       # tests
```

### Docker
```bash
docker compose up -d                           # levantar todo
docker compose -f compose.override.yml up -d   # con overrides de dev
docker compose build backend                   # reconstruir backend
docker compose logs backend -f                 # logs del backend
```

---

## Estructura del proyecto

```
soccer-tournaments/
├── docker-compose.yml
├── compose.override.yml
├── .env / .env.example
├── CLAUDE.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── django_project/     (settings, urls, wsgi)
│   ├── scripts/            (prestart.sh, start.sh)
│   ├── initial_data.py     (seed datos)
│   ├── clear_cache.py
│   └── apps/               (tournaments, teams, player, match, game, gameEvents)
├── frontend/
│   ├── angular.json
│   ├── proxy.conf.json     (/api → localhost:8000)
│   ├── nginx.conf          (/api → backend:8000 en prod)
│   ├── Dockerfile          (multi-stage: node build → nginx)
│   ├── openapi.config.ts   (generación cliente HTTP)
│   └── src/
│       ├── environments/   (apiUrl)
│       ├── app/
│       │   ├── core/auth/  (guards, interceptors, service)
│       │   ├── features/   (tournaments, teams, matches, games, players, auth, landing)
│       │   ├── layouts/    (navbar, sidebar, footer)
│       │   ├── shared/     (toast, data-grid, utils)
│       │   └── store/      (NgRx: Auth, Layout, Tournament, Team, Match)
│       ├── assets/scss/    (variables, bootstrap, app)
│       └── client/         (generado por ng-openapi)
└── docs/
    ├── ARCHITECTURE.md
    ├── DECISIONS.md
    └── FRONTEND_GUIDE.md
```

---

## Patrones de API

Los endpoints siguen `/api/{resource}/` con DRF:
- `GET/POST /api/tournaments/` — listar/crear
- `GET/PUT/PATCH/DELETE /api/tournaments/<id>/` — detalle
- Mismo patrón para teams, matches, games, players, gameevents
- `POST /api/auth/token/` — login (token DRF)

## Estilos globales (SCSS)

Los estilos globales están en `src/assets/scss/`. Configuración en `angular.json`:

- **`stylePreprocessorOptions.includePaths`**: `["src/assets/scss"]` — permite `@import 'variables'` desde cualquier `.scss` sin ruta relativa.
- **`styles`**: `bootstrap.scss` → `icons.scss` → `app.scss` → `styles.scss` (orden de carga).
- **`assets`**: `images/` → `/assets/images/`, `fonts/` → `/assets/fonts/`.

### Variables disponibles (`_variables.scss`)

```scss
// Bootstrap overrides
$primary: #22C55E; $secondary: #0F172A; $success: #4ADE80;
$info: #38BDF8; $warning: #FACC15; $danger: #EF4444;
$body-bg: #020617; $body-color: #CBD5E1;
$font-family-base: 'Inter', sans-serif;
$headings-font-family: 'Poppins', sans-serif;
$border-radius: 14px;

// Custom
$primary-hover: #16A34A;
$text-primary: #F8FAFC; $text-secondary: #CBD5E1; $text-muted: #64748B;
$bg-surface: #111827; $bg-elevated: #1E293B; $bg-navbar: #0F172A;
$state-live: #EF4444; $state-upcoming: #38BDF8;
$state-classified: #22C55E; $state-eliminated: #F59E0B;
$gradient-hero: linear-gradient(135deg, #0F172A 0%, #111827 50%, #16A34A 100%);
$shadow-default: 0 4px 20px rgba(0,0,0,0.25);
```

### Uso en componentes

```scss
@import 'variables';
.card { border-color: $border-default; }
.badge-live { background-color: $state-live; }
.btn-custom { background: $gradient-button; }
```

Rutas absolutas para assets: `url('/assets/images/logo.svg')`.

### Directorios preparados

`components/`, `pages/`, `plugins/`, `structure/`, `theme/`, `fonts/` — vacíos, listos para crecer.

Ver `docs/SCSS_GUIDE.md` para referencia completa.

## NgRx

Cada feature store sigue el patrón: `models.ts` → `actions.ts` → `reducer.ts` → `effects.ts` → `selectors.ts`.

Store slices actuales: `auth`, `layout`, `tournament`, `team`, `match`.

### Patrón estándar por slice

```typescript
// models.ts
interface XxxState { list: Entity[]; selected?: Entity; loading: boolean; error: string | null }

// actions.ts — createActionGroup con load/loadSuccess/loadFailure
export const XxxActions = createActionGroup({ source: 'Xxx', events: {
  Load: emptyProps(),
  'Load Success': props<{ list: Xxx[] }>(),
  'Load Failure': props<{ error: string }>(),
}});

// reducer.ts — createReducer con on() para cada acción
// selectors.ts — createFeatureSelector + createSelector
// effects.ts — @Injectable() class con createEffect() para llamadas HTTP
```

### Conectar componente al store

```typescript
private store = inject(Store);
tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });

ngOnInit() { this.store.dispatch(TournamentActions.load()); }
```

Ver `docs/NGRX_GUIDE.md` para referencia completa.
