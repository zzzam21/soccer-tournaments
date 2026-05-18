# Guía de Desarrollo — Soccer Tournaments

Instrucciones completas para levantar el ambiente local, trabajar con el frontend y backend, y usar los scripts del proyecto.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Levantar el ambiente local](#2-levantar-el-ambiente-local)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Servicios y puertos locales](#4-servicios-y-puertos-locales)
5. [Generación del cliente HTTP](#5-generación-del-cliente-http)
6. [Scripts del proyecto](#6-scripts-del-proyecto)
7. [Desarrollo frontend sin Docker](#7-desarrollo-frontend-sin-docker)
8. [Desarrollo backend sin Docker](#8-desarrollo-backend-sin-docker)
9. [Migraciones de base de datos](#9-migraciones-de-base-de-datos)
10. [Flujo completo de una nueva feature](#10-flujo-completo-de-una-nueva-feature)
11. [Problemas comunes](#11-problemas-comunes)

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| Docker Desktop | 4.x | https://www.docker.com/products/docker-desktop |
| Node.js | 20.x | https://nodejs.org |
| npm | 11.x | (viene con Node.js) |
| Python | 3.12 | https://www.python.org |
| Git | 2.x | https://git-scm.com |
| Git Bash (Windows) | — | (viene con Git; necesario para scripts `.sh`) |

---

## 2. Levantar el ambiente local

### Primera vez

> **Nota:** `frontend/src/client/` es código generado. Si ya está commiteado en el repo, salta al paso 4 directamente.

```bash
# 1. Clonar y entrar al proyecto
git clone <repo-url> soccer-tournaments
cd soccer-tournaments

# 2. Crear archivo de entorno
cp .env.example .env
# Editar .env si es necesario

# 3. Instalar dependencias del frontend (necesario para generar el cliente)
cd frontend
npm install
cd ..

# 4. Construir e iniciar backend + base de datos primero
docker compose build backend
docker compose up -d db backend

# 5. Esperar ~30 segundos a que el backend esté listo (migraciones + seed)
curl http://localhost:8000/api/utils/health-check/
# → {"status": "ok", "database": "connected"}

# 6. Generar el cliente HTTP Angular desde el schema OpenAPI
#    (en Windows usar Git Bash)
bash scripts/generate-client.sh

# 7. Construir el frontend (ahora que el cliente existe)
docker compose build frontend

# 8. Levantar el stack completo
docker compose up -d

# 9. Verificar que todo está funcionando
curl http://localhost:8000/api/utils/health-check/
# → {"status": "ok", "database": "connected"}

curl http://localhost:4200
# → HTML del frontend

# 10. (Solo la primera vez) Commitear el cliente generado
#     para que futuros clones no necesiten repetir estos pasos
git add frontend/src/client/
git commit -m "feat: cliente HTTP generado desde OpenAPI"
```

### Días siguientes (stack ya inicializado)

```bash
docker compose up -d
```

### Con overrides de desarrollo

```bash
docker compose -f docker-compose.yml -f compose.override.yml up -d
# DB expuesta en :5433, backend con hot-reload
```

### Ver logs en vivo

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f        # todos los servicios
```

### Detener el stack

```bash
docker compose down           # mantiene volúmenes (datos intactos)
docker compose down -v        # destruye volúmenes (reset total de datos)
```

---

## 3. Variables de entorno

El archivo `.env` en la raíz controla toda la configuración. Nunca commitear `.env` — está en `.gitignore`.

### Referencia completa

```env
# ── Django ──────────────────────────────────────────────────
SECRET_KEY=soccer-dev-secret-key-change-this-before-deploy
DEBUG=True                              # False en producción
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# ── PostgreSQL ───────────────────────────────────────────────
DB_ENGINE=django.db.backends.postgresql
DB_NAME=futbol_db
DB_USER=futbol_user
DB_PASSWORD=futbol_pass
DB_HOST=db                              # Hostname dentro de Docker
DB_PORT=5432

# ── CORS ─────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS=http://localhost:4200
CSRF_TRUSTED_ORIGINS=http://localhost:4200

# ── Superusuario inicial (seed data) ─────────────────────────
DJANGO_SUPERUSER_EMAIL=admin@admin.com
DJANGO_SUPERUSER_PASSWORD=admin123       # CAMBIAR en producción
```

### Si cambias DB_PASSWORD y ya tienes un volumen

```bash
docker compose down -v   # ⚠️ borra todos los datos
docker compose up -d     # reinicia desde cero
```

---

## 4. Servicios y puertos locales

| Servicio | URL local | Descripción |
|---|---|---|
| **Frontend** | http://localhost:4200 | App Angular (Nginx en Docker) |
| **Backend API** | http://localhost:8000 | Django REST Framework |
| **Swagger UI** | http://localhost:8000/api/docs/ | Documentación interactiva de la API |
| **OpenAPI Schema** | http://localhost:8000/api/schema/ | Schema JSON/YAML |
| **Admin (Django)** | http://localhost:8000/admin/ | Panel de administración |
| **PostgreSQL** | localhost:5432 | Puerto por defecto |
| **PostgreSQL (override)** | localhost:5433 | Puerto alternativo con compose.override.yml |

---

## 5. Generación del cliente HTTP

El frontend tiene un cliente autogenerado en `frontend/src/client/` que se crea desde el schema OpenAPI del backend usando `ng-openapi`.

### Cuándo regenerar

- Al agregar, modificar o eliminar un endpoint en el backend
- Al cambiar un serializer de DRF
- Al configurar el proyecto por primera vez

### Requisito

El backend debe tener instalado `drf-spectacular` (ya incluido en `requirements.txt`) con el schema en `/api/schema/`.

### Pasos

```bash
# El backend debe estar corriendo en localhost:8000
bash scripts/generate-client.sh
```

Este script hace internamente:

1. **Descarga el OpenAPI** del backend a `frontend/swagger.json`
2. **Ejecuta ng-openapi** para generar `frontend/src/client/` (servicios, modelos, providers)

### ¿Qué genera?

```
frontend/src/client/
├── models/          # Interfaces TypeScript (una por serializer de DRF)
├── services/        # Angular services con métodos tipados por endpoint
├── tokens/
├── utils/
├── index.ts
└── providers.ts     # provideDefaultClient() para app.config.ts
```

> **Regla:** Nunca editar manualmente `frontend/src/client/`. Los cambios se pierden al regenerar.

---

## 6. Scripts del proyecto

### `backend/scripts/prestart.sh`

Ejecutado automáticamente al iniciar el contenedor backend:

1. Espera a que PostgreSQL esté disponible
2. Aplica migraciones (`python manage.py migrate`)
3. Crea datos iniciales (`python initial_data.py` — superuser + torneos + equipos + jugadores)
4. Limpia caché (`python clear_cache.py`)

```bash
# No se ejecuta manualmente — es para uso interno de Docker
```

### `backend/scripts/start.sh`

Ejecuta `prestart.sh` y luego arranca Gunicorn.

```bash
# No se ejecuta manualmente — es para uso interno de Docker
```

### `backend/initial_data.py`

Crea datos semilla: superuser, 3 torneos, 22 equipos y 72 jugadores.

```bash
cd backend
python initial_data.py
```

### `backend/clear_cache.py`

Limpia la caché de Django.

```bash
cd backend
python clear_cache.py
```

### `scripts/generate-client.sh`

Genera el cliente Angular desde el OpenAPI del backend.

```bash
bash scripts/generate-client.sh
```

**Requiere:** backend corriendo en `localhost:8000` y haber ejecutado `npm install` en `frontend/` para instalar `ng-openapi` como dependencia de desarrollo.

---

## 7. Desarrollo frontend sin Docker

Para desarrollo activo del frontend con hot-reload:

```bash
# 1. (Primera vez) Instalar dependencias (node_modules está en .gitignore)
cd frontend
npm install

# 2. El backend debe estar corriendo (con Docker o local)
npm start      # levanta ng serve en http://localhost:4200
```

El proxy está configurado en `proxy.conf.json` para redirigir `/api` → `http://localhost:8000`.

### Scripts disponibles en `frontend/`

```bash
npm start               # ng serve con proxy
npm run build           # build de producción
npm run test            # tests
```

---

## 8. Desarrollo backend sin Docker

Para correr el backend localmente (requiere PostgreSQL accesible):

```bash
# 1. (Primera vez) Crear entorno virtual e instalar dependencias
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt

# 2. Con Docker corriendo solo la base de datos
docker compose up -d db

# 3. Correr migraciones y seed data
python manage.py migrate
python initial_data.py

# 4. Correr el backend en modo desarrollo con hot-reload
python manage.py runserver 0.0.0.0:8000
```

La API quedará disponible en `http://localhost:8000`.

### Agregar una dependencia Python

```bash
cd backend
pip install <paquete>
pip freeze > requirements.txt
```

---

## 9. Migraciones de base de datos

### Generar una nueva migración

```bash
# Con la DB corriendo (Docker o local)
cd backend
python manage.py makemigrations
```

### Aplicar migraciones

```bash
cd backend
python manage.py migrate

# O reiniciando el stack (el contenedor aplica migraciones automáticamente)
docker compose up -d
```

### Ver estado de migraciones

```bash
cd backend
python manage.py showmigrations
```

### Revertir última migración

```bash
cd backend
python manage.py migrate <app_name> <número_migración_anterior>
```

---

## 10. Flujo completo de una nueva feature

Ejemplo: agregar un endpoint `POST /api/tournaments/:id/start/` para iniciar un torneo.

### Paso 1 — Backend

```bash
# 1. Agregar vista o acción en backend/tournaments/views.py
# 2. Agregar URL en backend/tournaments/urls.py
# 3. (Opcional) Agregar serializer si es necesario
```

### Paso 2 — Migración (si hay cambios en modelos)

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Paso 3 — Regenerar cliente HTTP

```bash
# Con el backend corriendo
bash scripts/generate-client.sh
```

### Paso 4 — Frontend

```bash
# 1. Usar el servicio generado en src/client/ para llamar al endpoint
# 2. Si es necesario, agregar acción/efecto en store NgRx
# 3. Conectar el componente
```

### Paso 5 — Verificar

```bash
cd frontend && npm run build    # debe compilar sin errores
docker compose build backend    # imagen Docker OK
docker compose up -d            # stack completo
```

---

## 11. Problemas comunes

### El frontend no compila: "Cannot find module '../client/providers'"

El cliente HTTP no ha sido generado. Solución:

```bash
# Backend debe estar corriendo
bash scripts/generate-client.sh
```

### Error al conectar backend con DB: "could not connect to server"

La DB no está lista. El `prestart.sh` reintenta automáticamente cada 2 segundos hasta 5 minutos. Si persiste:

```bash
docker compose logs db    # ver logs de PostgreSQL
```

### DB_PASSWORD cambió pero el volumen tiene la contraseña anterior

```bash
docker compose down -v    # ⚠️ borra todos los datos
docker compose up -d      # reinicia desde cero
```

### Cambios en `frontend/src/` no se reflejan en la imagen Docker

El Docker usa una build estática. Reconstruir:

```bash
docker compose build frontend
docker compose up -d frontend
```

Para desarrollo activo con hot-reload, usar `npm start` directamente (ver sección 7).

### El cliente HTTP no se genera: "Cannot find module 'ng-openapi'"

`ng-openapi` debe estar instalado como dev dependency:

```bash
cd frontend
npm install
```

### El cliente HTTP no se genera: "Unexpected token" en swagger.json

El schema debe descargarse como JSON, no YAML. Asegúrate de que `scripts/generate-client.sh` use `?format=json`:

```bash
curl -s "http://localhost:8000/api/schema/?format=json" -o frontend/swagger.json
```

### El puerto 4200 o 8000 ya está en uso

Verificar si hay otro contenedor usando el puerto:

```bash
docker ps
# Si hay un contenedor de otro proyecto (ej. circulaweb-frontend-1),
# detenerlo o cambiarlo de puerto
```
