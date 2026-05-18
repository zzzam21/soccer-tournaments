# Arquitectura — Soccer Tournaments

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21 standalone + Signals + NgRx |
| Backend | Django 5.2 + Django REST Framework |
| Base de datos | PostgreSQL 16 |
| Servidor web | Nginx (frontend) / Gunicorn (backend) |
| Contenedores | Docker Compose |

## Estructura de rutas API

Todas las rutas están bajo `/api/`:

| Endpoint | Métodos | Descripción |
|---|---|---|
| `/api/auth/token/` | POST | Login (token DRF) |
| `/api/tournaments/` | GET, POST | Listar/crear torneos |
| `/api/tournaments/<id>/` | GET, PUT, PATCH, DELETE | Detalle de torneo |
| `/api/teams/` | GET, POST | Listar/crear equipos |
| `/api/teams/<id>/` | GET, PUT, PATCH, DELETE | Detalle de equipo |
| `/api/matches/` | GET, POST | Listar/crear jornadas |
| `/api/matches/<id>/` | GET, PUT, PATCH, DELETE | Detalle de jornada |
| `/api/games/` | GET, POST | Listar/crear partidos |
| `/api/games/<id>/` | GET, PUT, PATCH, DELETE | Detalle de partido |
| `/api/players/` | GET, POST | Listar/crear jugadores |
| `/api/players/<id>/` | GET, PUT, PATCH, DELETE | Detalle de jugador |
| `/api/gameevents/` | GET, POST | Listar/crear eventos |
| `/api/gameevents/<id>/` | GET, PUT, PATCH, DELETE | Detalle de evento |
| `/api/utils/health-check/` | GET | Health check |
| `/api/schema/` | GET | OpenAPI schema |
| `/api/docs/` | GET | Swagger UI |

## Frontend

- **Standalone components** con `ChangeDetectionStrategy.OnPush`
- **NgRx**: store slices para Auth, Layout, Tournament, Team, Match
- **Lazy loading**: cada feature se carga bajo demanda
- **Proxy dev**: Angular dev server redirige `/api` → `localhost:8000`
- **Producción**: Nginx sirve el build y redirige `/api` → `backend:8000`

## Flujo de datos

```
Angular (NgRx) → proxy/nginx → Django (DRF) → PostgreSQL
```

## Modelos

```
Tournament ──┬── Team ── Player
             └── Match ── Game ── GameEvent ── Player
```
