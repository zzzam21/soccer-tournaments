# Guía de Estilos Globales (SCSS)

Cómo se estructuran, importan y usan los estilos globales del frontend.

---

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Configuración en angular.json](#2-configuración-en-angularjson)
3. [Árbol de archivos](#3-árbol-de-archivos)
4. [Variables globales](#4-variables-globales)
5. [Orden de carga](#5-orden-de-carga)
6. [Cómo usar las variables en componentes](#6-cómo-usar-las-variables-en-componentes)
7. [Cómo agregar nuevos estilos globales](#7-cómo-agregar-nuevos-estilos-globales)
8. [Buenas prácticas](#8-buenas-prácticas)

---

## 1. Arquitectura general

Los estilos globales viven en `src/assets/scss/` y se dividen en tres grupos según cómo se consumen:

| Grupo | Cómo se incluye | Propósito |
|---|---|---|
| **Globales** | `angular.json > styles` (build) | Reset, Bootstrap, iconos, tema general |
| **Preprocesador** | `angular.json > stylePreprocessorOptions.includePaths` (import) | Variables, mixins — disponibles en cualquier `.scss` sin ruta relativa |
| **Estáticos** | `angular.json > assets` (copia) | Imágenes (`/assets/images/`), fuentes (`/assets/fonts/`) |

---

## 2. Configuración en angular.json

```jsonc
// frontend/angular.json (líneas 46–78)

"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "**/*", "input": "src/assets/images", "output": "/assets/images" },
  { "glob": "**/*", "input": "src/assets/fonts",   "output": "/assets/fonts" }
],

"stylePreprocessorOptions": {
  "includePaths": ["src/assets/scss"],
  "sass": {
    "silenceDeprecations": ["import", "global-builtin", "color-functions", "if-function"]
  }
},

"styles": [
  "src/assets/scss/bootstrap.scss",
  "src/assets/scss/icons.scss",
  "src/assets/scss/app.scss",
  "src/styles.scss"
]
```

### Qué hace cada sección

- **`assets`**: copia `images/` y `fonts/` al output del build. En runtime se accede como `/assets/images/logo.svg` o `/assets/fonts/Poppins.woff2`.
- **`stylePreprocessorOptions.includePaths`**: permite `@import 'variables'` en cualquier archivo `.scss` sin escribir `../../assets/scss/variables`.
- **`styles`**: archivos compilados e inyectados globalmente en el HTML en el orden listado.
- **`silenceDeprecations`**: silencia warnings de Sass sobre sintaxis legacy (`@import`, funciones de color).

---

## 3. Árbol de archivos

```
src/assets/
├── fonts/            → Archivos .woff2, .ttf (copiados a /assets/fonts/)
├── images/           → SVG, PNG, etc. (copiados a /assets/images/)
└── scss/
    ├── _variables.scss    → Overrides de Bootstrap (colores, tipografía)
    ├── bootstrap.scss     → Importa _variables + Bootstrap completo
    ├── icons.scss         → Estilos de iconos
    ├── app.scss           → Estilos globales de la app
    ├── custom.scss        → Overrides manuales
    ├── components/        → Estilos de componentes reutilizables (📁 vacío)
    ├── pages/             → Estilos de páginas específicas (📁 vacío)
    ├── plugins/           → Overrides de plugins third-party (📁 vacío)
    ├── structure/         → Layout: header, sidebar, footer (📁 vacío)
    └── theme/             → Variables por tema (claro/oscuro) (📁 vacío)
```

Los directorios vacíos están preparados para crecer según las necesidades del proyecto.

---

## 4. Variables globales

Definidas en `_variables.scss` (partial, no genera CSS por sí mismo):

```scss
// Bootstrap overrides
$primary:   #22C55E;     // Verde deportivo
$secondary: #0F172A;     // Azul oscuro premium
$success:   #4ADE80;     // Verde claro
$info:      #38BDF8;     // Azul neon
$warning:   #FACC15;     // Amarillo dorado
$danger:    #EF4444;     // Rojo moderno
$body-bg:   #020617;     // Negro azulado (fondo general)
$body-color:#CBD5E1;     // Gris claro (texto secundario)
$headings-color: #F8FAFC; // Blanco suave

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

Estas variables sobreescriben las de Bootstrap ANTES de que Bootstrap se compile, gracias al orden de `bootstrap.scss`:

```scss
// src/assets/scss/bootstrap.scss
@import 'variables';              // tus valores primero
@import 'bootstrap/scss/bootstrap'; // Bootstrap usa esos valores
```

---

## 5. Orden de carga

Los archivos en `angular.json > styles` se compilan en este orden:

```
1. bootstrap.scss    → Reset + grid + utilidades + componentes Bootstrap
2. icons.scss        → Estilos de iconos
3. app.scss          → Estilos globales de la aplicación
4. styles.scss       → Estilos de reset adicionales (raíz del proyecto)
```

Regla: los archivos posteriores pueden sobreescribir a los anteriores por especificidad o `!important`.

---

## 6. Cómo usar las variables en componentes

Gracias a `stylePreprocessorOptions.includePaths`, cualquier archivo `.scss` dentro de `src/app/` puede importar `_variables.scss` sin ruta relativa:

```scss
// src/app/features/tournaments/tournament-card.component.scss
@import 'variables';

.card-custom {
  border: 2px solid $primary;
  font-family: $font-family-base;
}
```

Esto también funciona para archivos dentro de `components/`, `pages/`, etc., una vez que se creen.

### Acceder a imágenes y fuentes desde SCSS

```scss
.logo {
  background-image: url('/assets/images/logo.svg');
}

@font-face {
  font-family: 'Poppins';
  src: url('/assets/fonts/Poppins-Regular.woff2') format('woff2');
}
```

Las rutas son absolutas desde la raíz del sitio porque `angular.json` mapea esos directorios a `/assets/`.

### Utility classes disponibles (definidas en `app.scss`)

```scss
// Gradientes
.gradient-hero         // fondo hero: #0F172A → #111827 → #16A34A
.gradient-button       // fondo botón: #22C55E → #16A34A
.bg-gradient-primary   // fondo primary degradado

// Sombras
.shadow-card           // 0 4px 20px rgba(0,0,0,0.25)

// Cards con hover
.card-hover            // eleva bg + border al hover

// Badges de estado
.badge-live            // rojo (#EF4444)
.badge-upcoming        // azul (#38BDF8)
.badge-finished        // gris (#64748B)
.badge-classified      // verde (#22C55E)
.badge-eliminated      // amarillo (#F59E0B)

// Fondos de sección
.section-dark          // #111827
.section-darker        // #020617

// Texto
.text-primary-custom   // #22C55E
.text-secondary-custom // #CBD5E1
.text-muted-custom     // #64748B
.text-subtle-custom    // #94A3B8
```

---

## 7. Cómo agregar nuevos estilos globales

### Nueva variable de color

```scss
// _variables.scss
$tournament-accent: #e83e8c;
```

### Nueva hoja de estilos global

1. Crear el archivo en `src/assets/scss/` (ej. `charts.scss`)
2. Agregarlo en `angular.json > styles`:

```jsonc
"styles": [
  "src/assets/scss/bootstrap.scss",
  "src/assets/scss/icons.scss",
  "src/assets/scss/charts.scss",     // ← nuevo
  "src/assets/scss/app.scss",
  "src/styles.scss"
]
```

### Nueva fuente

1. Colocar el archivo (`Poppins-Bold.woff2`) en `src/assets/fonts/`
2. Declarar el `@font-face` en `src/assets/scss/fonts/` o en `app.scss`

```scss
// src/assets/scss/fonts/_poppins.scss
@font-face {
  font-family: 'Poppins';
  font-weight: 700;
  src: url('/assets/fonts/Poppins-Bold.woff2') format('woff2');
}
```

### Nuevo partial en directorio existente

```scss
// src/assets/scss/components/_buttons.scss
.btn-tournament {
  background-color: $primary;
  color: white;
}
```

Luego importarlo desde `app.scss` o desde el componente que lo necesite.

---

## 8. Buenas prácticas

| Práctica | Explicación |
|---|---|
| **Prefiero `@import` sobre `@use`** por ahora | El proyecto arrancó con `@import` y `silenceDeprecations` activado. Migrar a `@use` progresivamente. |
| **Componentes con `:host`** | Usa `:host { }` en componentes Angular para evitar fugas de estilo. |
| **No sobreescribir Bootstrap** sin necesidad | Usa las utilidades de Bootstrap (`d-flex`, `gap-3`, `text-primary`) antes de escribir CSS custom. |
| **Paleta de colores** | Usa siempre las variables de `_variables.scss`. Nunca colores hardcodeados como `#22C55E`. |
| **Archivos en `components/`** | Son para estilos de componentes reutilizables (ej. botones, tarjetas, tablas). No confundir con estilos de componentes Angular. |
| **Archivos en `pages/`** | Solo para layouts complejos de página (ej. layout de dashboard). La mayoría del estilo debe vivir en el `.scss` del componente Angular. |
| **Fuentes** | Mantén solo pesos usados (Regular, Medium, Bold). Prefiere woff2 sobre ttf. |
