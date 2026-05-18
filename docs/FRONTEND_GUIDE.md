# Guía Frontend — Soccer Tournaments

## Estructura

```
src/
├── app/
│   ├── core/auth/         ← AuthService, guards, interceptors
│   ├── features/          ← Lazy modules por dominio
│   │   ├── tournaments/
│   │   ├── teams/
│   │   ├── matches/
│   │   ├── games/
│   │   ├── players/
│   │   ├── auth/
│   │   └── landing/
│   ├── layouts/           ← Layout principal (navbar, sidebar, footer)
│   ├── shared/            ← Componentes reutilizables
│   │   ├── components/
│   │   │   ├── toast-container/
│   │   │   └── data-grid/
│   │   └── utils/
│   └── store/             ← NgRx slices
│       ├── Authentication/
│       ├── Layout/
│       ├── Tournament/
│       ├── Team/
│       └── Match/
├── assets/scss/           ← Variables Bootstrap, estilos globales
├── environments/          ← apiUrl por entorno
└── client/                ← Generado por ng-openapi (NO editar)
```

## Convenciones

- Componentes **standalone** con `ChangeDetectionStrategy.OnPush`
- Store NgRx: `models.ts` → `actions.ts` → `reducer.ts` → `effects.ts` → `selectors.ts`
- Lazy loading en `app.routes.ts` para cada feature
- No editar `src/client/` (se regenera con `generate-client.sh`)

## Conexión al API

El proxy de desarrollo (`proxy.conf.json`) redirige `/api` → `http://localhost:8000`.
En producción, Nginx hace el proxy a `backend:8000`.

Usar el cliente generado en `src/client/` para llamar al API.
