# Guía de NgRx — Manejo de estado con BD

Cómo se estructura, configura y usa NgRx para gestionar el estado global y las operaciones con la base de datos.

---

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Árbol de archivos](#2-árbol-de-archivos)
3. [Configuración global](#3-configuración-global)
4. [El patrón por feature slice](#4-el-patrón-por-feature-slice)
5. [Flujo de datos: UI → API → Store](#5-flujo-de-datos-ui--api--store)
6. [Tournament — ejemplo completo](#6-tournament--ejemplo-completo)
7. [Cómo crear un nuevo feature slice](#7-cómo-crear-un-nuevo-feature-slice)
8. [Cómo conectar un componente al store](#8-cómo-conectar-un-componente-al-store)
9. [Cómo implementar efectos con llamadas HTTP](#9-cómo-implementar-efectos-con-llamadas-http)
10. [Buenas prácticas](#10-buenas-prácticas)

---

## 1. Arquitectura general

NgRx maneja todo el estado global de la aplicación en slices independientes:

```
┌──────────────────────────────────────────────────┐
│                  Root Store                       │
│  ┌────────┐  ┌──────┐  ┌─────────┐  ┌────┐  ┌─────┐ │
│  │  Auth  │  │Layout│  │Tournament│  │Team│  │Match│ │
│  └────────┘  └──────┘  └─────────┘  └────┘  └─────┘ │
└──────────────────────────────────────────────────┘
```

Cada slice es independiente y autocontenido (models, actions, reducer, effects, selectors). No hay helpers compartidos ni generación automática.

**Stack**: NgRx standalone (`provideStore`, `provideEffects`, `provideStoreDevtools`), Angular 21.

---

## 2. Árbol de archivos

```
src/app/store/
├── index.ts                              # Root reducer map
├── Authentication/
│   ├── auth.models.ts
│   ├── authentication.actions.ts
│   ├── authentication.reducer.ts
│   ├── authentication.effects.ts
│   └── authentication.selectors.ts
├── Layout/
│   ├── layout.models.ts
│   ├── layout.actions.ts
│   ├── layout.reducer.ts
│   ├── layout.effects.ts
│   └── layout.selectors.ts
├── Tournament/
│   ├── tournament.models.ts
│   ├── tournament.actions.ts
│   ├── tournament.reducer.ts
│   ├── tournament.effects.ts
│   └── tournament.selectors.ts
├── Team/
│   ├── team.models.ts
│   ├── team.actions.ts
│   ├── team.reducer.ts
│   ├── team.effects.ts
│   └── team.selectors.ts
└── Match/
    ├── match.models.ts
    ├── match.actions.ts
    ├── match.reducer.ts
    ├── match.effects.ts
    └── match.selectors.ts
```

---

## 3. Configuración global

### Root reducer map (`store/index.ts`)

Combina todos los reducers en un solo `ActionReducerMap`:

```typescript
export interface RootReducerState {
  auth: AuthState;
  layout: LayoutState;
  tournament: TournamentState;
  team: TeamState;
  match: MatchState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  auth: authReducer,
  layout: layoutReducer,
  tournament: tournamentReducer,
  team: teamReducer,
  match: matchReducer,
};
```

### Providers (`app.config.ts`)

Se registran usando las funciones standalone de NgRx:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(rootReducer),
    provideEffects(
      AuthenticationEffects,
      LayoutEffects,
      TournamentEffects,
      TeamEffects,
      MatchEffects,
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
```

---

## 4. El patrón por feature slice

Cada slice tiene exactamente 5 archivos con responsabilidades fijas:

| Archivo | Propósito |
|---|---|
| `*.models.ts` | Interfaces de datos (`Entity`, `State`) y `initialState` |
| `*.actions.ts` | `createActionGroup` con eventos del slice |
| `*.reducer.ts` | `createReducer` con transforms inmutables |
| `*.effects.ts` | Efectos secundarios (llamadas HTTP, timers, etc.) |
| `*.selectors.ts` | `createFeatureSelector` + `createSelector` |

### Estado común (slices con datos de BD)

```typescript
interface XxxState {
  list: Entity[];      // datos obtenidos del backend
  selected?: Entity;   // elemento seleccionado (opcional)
  loading: boolean;    // indicador de carga
  error: string | null;
}
```

### Tríada de acciones estándar

```
XxxActions.load          → emptyProps()       → loading = true
XxxActions.loadSuccess   → props<{ list }>()  → list = data, loading = false
XxxActions.loadFailure   → props<{ error }>() → error = msg, loading = false
```

---

## 5. Flujo de datos: UI → API → Store

```
┌──────────┐   dispatch()   ┌──────────┐   effect   ┌─────────┐
│          │ ──────────────> │          │ ──────────> │         │
│ Component│                │  Action  │            │  Effect  │
│          │ <────────────── │          │ <────────── │         │
└──────────┘   select()     └──────────┘   reducer   └─────────┘
                                                         │
                                                    HTTP call
                                                         │
                                                    ┌─────────┐
                                                    │ Backend  │
                                                    │ (API)    │
                                                    └─────────┘
```

1. **Componente** despacha una acción (ej. `TournamentActions.load`)
2. **Reducer** sincrónico: actualiza `loading = true`
3. **Effect** detecta la acción, hace la llamada HTTP
4. **Effect** despacha `loadSuccess(data)` o `loadFailure(error)`
5. **Reducer** actualiza el estado con los datos recibidos
6. **Componente** reacciona al cambio via selector (`store.select` o `toSignal`)

---

## 6. Tournament — ejemplo completo

### `tournament.models.ts`

```typescript
export interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface TournamentState {
  list: Tournament[];
  selected: Tournament | null;
  loading: boolean;
  error: string | null;
}

export const initialTournamentState: TournamentState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};
```

### `tournament.actions.ts`

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Tournament } from './tournament.models';

export const TournamentActions = createActionGroup({
  source: 'Tournament',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Tournament[] }>(),
    'Load Failure': props<{ error: string }>(),
    Select: props<{ id: number }>(),
  },
});
```

### `tournament.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { TournamentActions } from './tournament.actions';
import { TournamentState, initialTournamentState } from './tournament.models';

export const tournamentReducer = createReducer<TournamentState>(
  initialTournamentState,
  on(TournamentActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.loadSuccess, (state, { list }) => ({
    ...state,
    list,
    loading: false,
    error: null,
  })),
  on(TournamentActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TournamentActions.select, (state, { id }) => ({
    ...state,
    selected: state.list.find((t) => t.id === id) ?? null,
  })),
);
```

### `tournament.effects.ts`

```typescript
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class TournamentEffects {
  constructor(private actions$: Actions) {}
}
```

### `tournament.selectors.ts`

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TournamentState } from './tournament.models';

export const selectTournamentState = createFeatureSelector<TournamentState>('tournament');
export const selectTournamentList = createSelector(selectTournamentState, (s) => s.list);
export const selectSelectedTournament = createSelector(selectTournamentState, (s) => s.selected);
export const selectTournamentLoading = createSelector(selectTournamentState, (s) => s.loading);
```

---

## 7. Cómo crear un nuevo feature slice

Supongamos que necesitas un slice `Player`.

### Paso 1 — Crear la carpeta

```
src/app/store/Player/
```

### Paso 2 — `player.models.ts`

```typescript
export interface Player {
  id: number;
  name: string;
  team: number;
  position: string;
}

export interface PlayerState {
  list: Player[];
  selected: Player | null;
  loading: boolean;
  error: string | null;
}

export const initialPlayerState: PlayerState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};
```

### Paso 3 — `player.actions.ts`

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Player } from './player.models';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Player[] }>(),
    'Load Failure': props<{ error: string }>(),
    Select: props<{ id: number }>(),
  },
});
```

### Paso 4 — `player.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';
import { PlayerState, initialPlayerState } from './player.models';

export const playerReducer = createReducer<PlayerState>(
  initialPlayerState,
  on(PlayerActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(PlayerActions.loadSuccess, (state, { list }) => ({
    ...state, list, loading: false, error: null,
  })),
  on(PlayerActions.loadFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),
  on(PlayerActions.select, (state, { id }) => ({
    ...state,
    selected: state.list.find((p) => p.id === id) ?? null,
  })),
);
```

### Paso 5 — `player.effects.ts`

```typescript
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class PlayerEffects {
  constructor(private actions$: Actions) {}
}
```

### Paso 6 — `player.selectors.ts`

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerState } from './player.models';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');
export const selectPlayerList = createSelector(selectPlayerState, (s) => s.list);
export const selectSelectedPlayer = createSelector(selectPlayerState, (s) => s.selected);
export const selectPlayerLoading = createSelector(selectPlayerState, (s) => s.loading);
```

### Paso 7 — Registrar en `store/index.ts`

```typescript
import { PlayerState } from './Player/player.models';
import { playerReducer } from './Player/player.reducer';

export interface RootReducerState {
  // ... slices existentes
  player: PlayerState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  // ... reducers existentes
  player: playerReducer,
};
```

### Paso 8 — Registrar effects en `app.config.ts`

```typescript
import { PlayerEffects } from './store/Player/player.effects';

provideEffects(
  // ... effects existentes
  PlayerEffects,
),
```

---

## 8. Cómo conectar un componente al store

### Opción A — Signals (recomendada, Angular 17+)

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { TournamentActions } from '../../../store/Tournament/tournament.actions';
import { selectTournamentList, selectTournamentLoading } from '../../../store/Tournament/tournament.selectors';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <p>Cargando...</p>
    }
    @for (t of tournaments(); track t.id) {
      <div>{{ t.name }}</div>
    }
  `,
})
export class TournamentListComponent implements OnInit {
  private store = inject(Store);

  tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });
  loading = toSignal(this.store.select(selectTournamentLoading), { initialValue: false });

  ngOnInit() {
    this.store.dispatch(TournamentActions.load());
  }
}
```

### Opción B — Async pipe

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { TournamentActions } from '../../../store/Tournament/tournament.actions';
import { selectTournamentList, selectTournamentLoading } from '../../../store/Tournament/tournament.selectors';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="loading$ | async">Cargando...</div>
    <div *ngFor="let t of tournaments$ | async">{{ t.name }}</div>
  `,
})
export class TournamentListComponent implements OnInit {
  private store = inject(Store);

  tournaments$ = this.store.select(selectTournamentList);
  loading$ = this.store.select(selectTournamentLoading);

  ngOnInit() {
    this.store.dispatch(TournamentActions.load());
  }
}
```

---

## 9. Cómo implementar efectos con llamadas HTTP

Actualmente todos los effects están como stub. Aquí está el patrón para conectarlos al backend usando el cliente generado (`src/client/`):

### Ejemplo: TournamentEffects con API real

```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TournamentService } from '../../../client/services/tournament.service';
import { TournamentActions } from './tournament.actions';

@Injectable()
export class TournamentEffects {
  private actions$ = inject(Actions);
  private tournamentService = inject(TournamentService);

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.load),
      mergeMap(() =>
        this.tournamentService.getTournaments().pipe(
          map((list) => TournamentActions.loadSuccess({ list })),
          catchError((error) => of(TournamentActions.loadFailure({
            error: error.message ?? 'Error al cargar torneos',
          }))),
        ),
      ),
    ),
  );
}
```

### Patrón general para efectos CRUD

```typescript
load$ = createEffect(() => this.actions$.pipe(
  ofType(XxxActions.load),
  mergeMap(() => this.service.getAll().pipe(
    map((list) => XxxActions.loadSuccess({ list })),
    catchError((err) => of(XxxActions.loadFailure({ error: err.message }))),
  )),
));

create$ = createEffect(() => this.actions$.pipe(
  ofType(XxxActions.create),
  mergeMap(({ data }) => this.service.create(data).pipe(
    map((item) => XxxActions.createSuccess({ item })),
    catchError((err) => of(XxxActions.createFailure({ error: err.message }))),
  )),
));

// loadSuccess → reload list
refreshOnCreate$ = createEffect(() => this.actions$.pipe(
  ofType(XxxActions.createSuccess),
  map(() => XxxActions.load()),
));
```

---

## 10. Buenas prácticas

| Práctica | Explicación |
|---|---|
| **`createActionGroup`** | Usa `createActionGroup` en vez de `createAction` individuales. Es más legible y escalable. |
| **Reducer puro** | Los reducers nunca deben tener side effects ni llamar APIs. Solo transforman estado. |
| **Efectos para side effects** | Toda llamada HTTP, timer, localStorage, etc. va en effects, nunca en componentes. |
| **`mergeMap` vs `switchMap`** | Usa `mergeMap` para cargas de listas (permite múltiples peticiones simultáneas) y `switchMap` para búsquedas o detalle (cancela la anterior). |
| **Errores en effects** | Siempre capturar errores con `catchError` y despachar `*Failure` para que el reducer pueda mostrar feedback al usuario. |
| **Selectors derivados** | Crea selectores para cualquier computo derivado (filtros, transformaciones, sumas). El store devtools los trackea. |
| **`toSignal`** | Prefiere `toSignal` sobre `async` pipe en componentes con OnPush. `toSignal` se integra nativamente con el change detection de Signals. |
| **Estado mínimo** | Guarda solo los datos crudos en el store. Los derivados (items filtrados, totales) van en selectors. |
| **No mutar** | Nunca mutar propiedades del estado. Siempre retornar un nuevo objeto (spread operator o Immer). |
| **Devtools** | Usa Redux DevTools en Chrome durante desarrollo para inspeccionar acciones, estado y viajar en el tiempo. |
