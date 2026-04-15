# api — project rules

## Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: Cloudflare D1 via Drizzle ORM
- **Validation**: Zod (with `@hono/zod-validator`)
- **Lint/format**: Biome
- **Package manager**: Bun

## Architecture — Onion

Strict dependency direction: `transport → services → repos/external → domain`.

```
src/
├── domain/         # Pure. No infra imports.
│   ├── schema/     # Drizzle tables — source of truth for DB
│   ├── models/     # Types inferred from drizzle schema
│   └── api/        # Zod schemas for request/response DTOs
├── repos/          # DB access. Takes drizzle client via DI.
├── external/       # 3rd-party HTTP/SDK clients.
├── services/       # Business logic. Depends on repos + external.
├── transport/      # Hono routes + middleware. Depends on services only.
├── container.ts    # Composition root. Wires everything from env.
└── index.ts        # Hono app entry.
```

### Layering rules (enforced by Biome `noRestrictedImports`)

- `domain/**` — imports nothing from other `src/` folders.
- `repos/**`, `external/**` — may import from `domain/**` only.
- `services/**` — may import from `domain/**`, `repos/**`, `external/**`.
- `transport/**` — may import from `domain/**`, `services/**`. **Never `repos/**` or `external/**`.**
- `container.ts`, `index.ts` — composition root, may import from anywhere.

Use the `@/*` path alias (configured in `tsconfig.json` + biome rules) for all intra-src imports.

## Hard rules

- **No `any`, ever.** Biome `suspicious/noExplicitAny` is set to error. Use `unknown` + narrowing, or define a real type.
- **`import type` for type-only imports.** Biome `style/useImportType` is error. `verbatimModuleSyntax` is on in tsconfig.
- **All DB access through a repo.** Services never touch drizzle directly.
- **All KV access through a repo.** Services never touch `env.CACHE` directly — use `CacheRepo` / `ModuleCacheRepo` / `PrerequisiteCacheRepo`.
- **All outbound HTTP through `external/`.** Services never call `fetch` directly.
- **Transport is thin**: validate input with zod → call a service → return service output. No business logic in handlers.
- **Zod schemas live in `domain/api`**; Drizzle tables in `domain/schema`; models in `domain/models` are inferred from schema.

## Modules & Prerequisites

Reports are produced by running **prerequisites** (data producers) and **modules** (analysis units) in dependency order, orchestrated by `ReportOrchestratorService`.

- **Prerequisites** (`services/prerequisites/<name>/`) scrape/derive raw data (page scrape, page intelligence). Registered via `registerPrerequisite`. Each declares `type`, optional `dependsOn`, `resultSchema`, `cacheTtlMs`, and `run`.
- **Modules** (`services/modules/<name>/`) consume prerequisite output and produce report sections (lighthouse, five-sec-test). Registered via `registerModule`. Same shape as prerequisites.
- Execution: on report creation, the orchestrator inserts a `prerequisite_run` / `module_run` row per registered entry, consults the cache, and either short-circuits to `completed` or dispatches a Cloudflare Workflow (`prerequisite-run` / `module-run`) which invokes the `run` function.
- Dependencies are declarative via `dependsOn: [...]`. The orchestrator gates dispatch until every declared dep is `completed` and passes resolved results to the runner via `ctx.prerequisites.get(type, schema)`.
- Adding a new module/prereq: one folder with `runner.ts`, `result.schema.ts`, `module.ts` or `prerequisite.ts`, plus a side-effect import in `services/modules/index.ts` or `services/prerequisites/index.ts`. Nothing else — caching, dispatch, and persistence are automatic.

## Cache (mandatory)

**Every module and every prerequisite MUST be cached in Cloudflare KV.** The cache is a first-class part of the architecture, not an optimization.

- **Binding**: `env.CACHE` (KV namespace `CACHE` in `wrangler.jsonc`).
- **Repo layer**: `CacheRepo` wraps raw KV. `ModuleCacheRepo` and `PrerequisiteCacheRepo` are typed wrappers that own key shape and TTL enforcement. Services and workflows use the typed wrappers — never `env.CACHE` directly.
- **Key shape**: `module:<type>:<normalizedUrl>` and `prereq:<type>:<normalizedUrl>`. URLs MUST be passed through `domain/url#normalizeUrl` before building a key.
- **Minimum TTL**: **1 hour** (`CACHE_MIN_TTL_MS` in `domain/cache-policy.ts`). Enforced at registration time — `registerModule` / `registerPrerequisite` throw if `cacheTtlMs` is non-zero and below the floor. The cache repos also clamp to the floor on writes as a defence in depth.
- **Opt-out**: `cacheTtlMs: 0` explicitly disables caching for a module/prereq. Reserve this for the rare case where a run must never be reused.
- **Infinite TTL**: prerequisites may use `Number.POSITIVE_INFINITY` for D1-backed long-term caching; KV entries are still written with the floor TTL and refreshed on each read-through miss.
- **Read path** (`ReportOrchestratorService.kickoffReport`):
  1. **Prerequisites**: try `PrerequisiteCacheRepo.findFresh` (KV) → on hit, upsert a D1 `prerequisite_results` row (to satisfy the `prerequisite_runs.prerequisite_result_id` FK) and insert a `completed` run. On miss, fall through to the D1 `findFresh`; a D1 hit is warmed back into KV.
  2. **Modules**: try `ModuleCacheRepo.findFresh` (KV) → on hit, insert a `completed` `module_run` row with the cached `resultJson` and skip the workflow entirely.
- **Write path** (workflows):
  - `prerequisite-run.workflow`: after the validated result is upserted to D1, a `step.do("kv-cache-put", ...)` writes to `PrerequisiteCacheRepo`.
  - `module-run.workflow`: before marking the run completed, a `step.do("kv-cache-put", ...)` writes to `ModuleCacheRepo`.
  Both writes are wrapped in `step.do` so they are idempotent under workflow retries.
- **Invalidation**: TTL-only. If explicit invalidation is ever needed, add a `delete` path through the typed repos — never reach into `env.CACHE` from outside `repos/`.
- **One-time setup**: `wrangler kv namespace create CACHE` → paste the id into `wrangler.jsonc` → `bun run cf-typegen`.

## Scripts

- `bun run dev` — wrangler dev
- `bun run deploy` — wrangler deploy (minified)
- `bun run check` — Biome lint + format + organize imports (writes)
- `bun run lint` — Biome lint only
- `bun run typecheck` — `tsc --noEmit`
- `bun run db:generate` — generate a new Drizzle migration from schema
- `bun run db:migrate:local` — apply migrations to local D1
- `bun run db:migrate:remote` — apply migrations to remote D1
- `bun run cf-typegen` — regenerate `CloudflareBindings` from wrangler.jsonc

## Migration workflow

1. Edit `src/domain/schema/index.ts`.
2. `bun run db:generate` → commit the generated SQL under `drizzle/`.
3. `bun run db:migrate:local` to apply to the local D1.
4. On deploy, `bun run db:migrate:remote`.

## D1 setup (one-time)

1. `wrangler d1 create pagereport`
2. Paste the returned `database_id` into `wrangler.jsonc` (replace `REPLACE_WITH_D1_ID`).
3. `bun run cf-typegen` so `CloudflareBindings` picks up `DB`.
