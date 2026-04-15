## Rules
1. **MUST**: Any type of workarounds are not allowed. Everything needs to be implemented properly without any monkey patches. Need to research properly
2. **MUST**: If any workarounds are seen then suggest to remove them
3. **MUST**: DO NOT make any file monolithic instead make small modular files which are easy to maintain
4. **MUST**: In the frontend only one component per file is allowed. So create seprate files for each component
6. **MUST**: When removing some component file always first clean up its keys from i18n translation files
7. **MUST**: When adding a new component or updating one, always first add the translations for it for all languages in the i18n translation files
8. **MUST**: Always follow this data flow repos -> service -> router. router can never call repos directly and service can never use db directly. stick to onion architecture strictly.
9. **MUST**: Before adding anything in Frontend or backend we have to ensure that we keep everything platform agnostic and dont use the platform clients like meta client directly. we have to go through the platform client
10. **MUST**: Never leave in dead and unused code. Always clean up the code and remove files
11. **MUST**: Always run build and lint anf type check after update and make sure it passess without workarounds. like avoid ignoring with eslint or using any type.
12. **MUST**: If the errors are older then your update then try to resolve them still or ask me what to do
13. **MUST**: Never create duplicate code, always see if that code is already available or not
14. **MUST**: Make sure we dont introduce n+1 queries that can upset the performance. 
15. **MUST**: If some query needs index and we can add that index without overloading db we should add that index for faster processing
16. **MUST**: Make sure to make the UI responsive for both mobile and desktop
17. **MUST**: When working on the UI we have to make sure that UI doesnt look generic. Besides UI we have to strongly focus on making the UX as easy as possible for a layman like dropshippers to understand. We have to provide the tooltip guides everywhere needed.
18. **MUST**: we have to be platform agnostic, never hardcode anything that can make our platform otherwise
19. **MUST**: Always use phosphor icons not the lucid ones

## Monorepo layout

This repo is a Bun workspace-based monorepo orchestrated by **Turborepo**:

```
pagereport/
├── package.json        # root — workspaces, turbo scripts, single devDep: turbo
├── turbo.json          # task pipeline definition
├── bun.lock            # single root lockfile (do not create per-workspace locks)
├── api/                # Hono on Cloudflare Workers (backend)
└── app/                # SvelteKit on Cloudflare Workers (frontend)
```

### Running tasks

Always run tasks from the **root** via the root scripts (which delegate to turbo). Do NOT `cd` into a workspace unless you really need to run something workspace-specific:

- `bun run dev` — `turbo run dev` (runs both workspaces in parallel, persistent)
- `bun run build` — `turbo run build` (cached)
- `bun run lint` — `turbo run lint` (cached)
- `bun run check` — `turbo run check` (cached)
- `bun run typecheck` — `turbo run typecheck` (cached)
- `bun run format` — `turbo run format` (not cached)
- `bun run deploy` — `turbo run deploy` (depends on build + lint + check)

To run a task in a single workspace: `bun run build --filter=app` (turbo filter syntax).

Before handing off any change, **root-level** `bun run lint && bun run check && bun run build` must be green.

### Workspace discipline

- New shared code (types, utilities) that both `api` and `app` need should live in a new `packages/*` workspace. Do NOT reach across with relative imports like `../api/...`.
- Each workspace keeps its own `package.json` with its own deps. Dependencies are added with `bun add <pkg> --filter=app` (or `--filter=api`).
- Each workspace keeps its own `CLAUDE.md` with stack-specific rules. The root `CLAUDE.md` (this file) only holds rules that apply to both.
- Never create per-workspace `bun.lock` files — Bun workspaces use a single root lockfile.
- Each task in `turbo.json` must exist as a script in every workspace that should participate. Workspaces without the script are skipped silently.