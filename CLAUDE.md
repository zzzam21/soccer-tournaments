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

## NgRx

Cada feature store sigue el patrón: `models.ts` → `actions.ts` → `reducer.ts` → `effects.ts` → `selectors.ts`.

Store slices actuales: `auth`, `layout`, `tournament`, `team`, `match`.
