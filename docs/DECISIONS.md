# Decisiones Técnicas — Soccer Tournaments

## 2026-05-18

### Separación de scripts de inicio
Se dividió `entrypoint.sh` en `scripts/prestart.sh` + `scripts/start.sh`, siguiendo el patrón de Circula.
- `prestart.sh`: espera DB, migraciones, seed data, clear cache
- `start.sh`: ejecuta prestart + arranca gunicorn

### Estructura frontend replicada de Circula
- NgRx con slices: auth, layout, tournament, team, match
- `core/auth/` con interceptors, guards y service
- `environments/` con apiUrl centralizada
- `proxy.conf.json` + `nginx.conf` para proxy inverso

### Seed data
Se agregó `initial_data.py` con datos de ejemplo:
- 3 torneos (Copa Mundial 2026, Liga Colombiana 2026, Eurocopa 2024)
- 22 equipos
- 72 jugadores

### Health-check endpoint
Se agregó `GET /api/utils/health-check/` que verifica conexión a la base de datos.

### Documentación API
Se agregó `drf-spectacular` con schema OpenAPI en `/api/schema/` y Swagger UI en `/api/docs/`.
