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
- **All outbound HTTP through `external/`.** Services never call `fetch` directly.
- **Transport is thin**: validate input with zod → call a service → return service output. No business logic in handlers.
- **Zod schemas live in `domain/api`**; Drizzle tables in `domain/schema`; models in `domain/models` are inferred from schema.

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
