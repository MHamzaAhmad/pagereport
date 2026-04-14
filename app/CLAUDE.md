# app — project rules

## Stack

- **Framework**: SvelteKit (Svelte 5 runes) on Cloudflare Workers (`@sveltejs/adapter-cloudflare`)
- **Styling**: TailwindCSS v4 (CSS-first config in `src/app.css`)
- **UI primitives**: hand-written wrappers in `src/lib/components/ui/`, built on **bits-ui** (headless Svelte 5 primitives) where interactivity is needed (tooltip, etc.)
- **Icons**: `phosphor-svelte`
- **State**: Svelte 5 runes in `.svelte.ts` classes — no external state lib
- **i18n**: `svelte-i18n` with per-locale JSON dictionaries in `src/lib/i18n/locales/`
- **Validation**: `zod`
- **Lint**: ESLint (flat config) with `typescript-eslint`, `eslint-plugin-svelte`, `eslint-plugin-boundaries`, `eslint-plugin-unused-imports`
- **Format**: Prettier with `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`
- **Package manager**: Bun

Biome is intentionally **not** used — it lacks full `.svelte` support and we don't accept partial-support workarounds.

## Architecture — layered, feature-based

Strict dependency direction enforced by `eslint-plugin-boundaries` (see `eslint.config.js`):

```
src/
├── lib/
│   ├── types/          # Pure TS types. Imports nothing.
│   ├── utils/          # Pure helpers (cn, etc.). Imports only utils.
│   ├── api/            # Typed fetch client + endpoint functions. Imports types, utils.
│   ├── stores/         # Svelte 5 rune state classes. Imports api, types, utils.
│   ├── i18n/           # svelte-i18n setup and locale dictionaries.
│   ├── components/ui/  # UI primitives (Button, Input, Card, …). Import utils only.
│   └── features/       # Feature-scoped Svelte components + hooks.
│       ├── report-input/
│       └── report-view/
│           └── modules/  # Module registry + per-module folders
└── routes/             # SvelteKit pages. Import features, stores, ui, i18n, types.
```

### Layer rules

- `types/**` — imports nothing.
- `utils/**` — imports only `utils`.
- `i18n/**` — imports only `utils`.
- `api/**` — imports `types`, `utils`. **Never** components or stores.
- `stores/**` — imports `api`, `types`, `utils`. **Never** components.
- `components/ui/**` — imports `ui`, `utils` only. **Never** features/stores/api.
- `features/**` — imports `api`, `stores`, `types`, `components/ui`, `i18n`, `utils`, other `features`.
- `routes/**` — imports `features`, `stores`, `types`, `components/ui`, `i18n`, `utils`. **Never** `api` directly.

Violations fail `bun run lint`.

## Hard rules

- **No `any`**, ever. Use `unknown` + narrowing or define a real type. Enforced by `@typescript-eslint/no-explicit-any: error`.
- **One component per file.** Never put multiple Svelte components in one file.
- **`import type`** for type-only imports — enforced by `@typescript-eslint/consistent-type-imports`.
- **Components never call `fetch` directly.** Always go through `$lib/api`.
- **Routes never import `$lib/api` directly.** Go through a feature or a store.
- **All user-facing strings go through `svelte-i18n`.** No hard-coded English in components. Before adding a component, add its keys to **every** locale JSON under `src/lib/i18n/locales/` (currently `en.json`).
- **Platform-agnostic.** The module registry is the only way the UI learns about modules — no `switch (moduleType)` anywhere else.
- **No unused code.** `unused-imports` is an error. Delete dead files and exports.
- **No workarounds.** If something doesn't fit cleanly, research properly and fix the root cause.
- **Responsive.** Every feature must work at 375px width.

## Adding a new module (frontend side)

When the backend registers a new module (e.g. `my_module`):

1. Create `src/lib/features/report-view/modules/my-module/`:
   - `schema.ts` — zod schema **matching the backend's `result.schema.ts` exactly**.
   - `MyModuleResult.svelte` — one component, takes `{ result }` prop typed from the schema.
   - `index.ts` — calls `registerModule({ moduleType, labelKey, descriptionKey, schema, component })`.
2. Add a side-effect import in `src/lib/features/report-view/modules/index.ts`:
   ```ts
   import './my-module';
   ```
3. Add translation keys for `modules.myModule.label`, `modules.myModule.description`, and any field labels/tooltips to **every** locale JSON in `src/lib/i18n/locales/`.

No routing changes, no switch statements. `ModuleCard` picks up the renderer from the registry automatically.

## Adding a new UI primitive

1. Check `src/lib/components/ui/` for an existing primitive you can extend.
2. If you need headless behavior (dropdown, dialog, popover, combobox), use **bits-ui**.
3. Create a single `.svelte` file. One component per file. Use Tailwind classes + `tailwind-variants` for variants. Use `cn()` from `$lib/utils/cn` to merge class props.
4. Never place business logic in a UI primitive.

## Scripts

- `bun run dev` — Vite dev server
- `bun run build` — production build via Cloudflare adapter
- `bun run preview` — build then wrangler dev
- `bun run check` — `svelte-kit sync && svelte-check` (strict TS)
- `bun run lint` — ESLint + Prettier check (includes `.svelte` files)
- `bun run format` — Prettier write + ESLint `--fix`
- `bun run deploy` — build + `wrangler deploy`

Before handing off any change, run:

```
bun run lint && bun run check && bun run build
```

All three must pass cleanly — no ESLint disables, no `any`, no ignored errors.

## Environment

- Copy `.env.example` to `.env` and set `PUBLIC_API_BASE_URL` to the backend origin (e.g. `http://localhost:8787`).
- `PUBLIC_` prefix is required by SvelteKit to expose vars to the client.

## Known backend prerequisite

The backend (`api/`) currently has no CORS middleware. The FE dev server runs at `http://localhost:5173`, so `hono/cors` must be added to `api/src/index.ts` before cross-origin requests will work in the browser. This is a separate change outside this project.
