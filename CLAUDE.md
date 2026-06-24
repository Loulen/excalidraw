# CLAUDE.md

## Project Structure

Excalidraw is a **monorepo** with a clear separation between the core library and the application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples (NextJS, browser script)

## Development Workflow

1. **Package Development**: Work in `packages/*` for editor features
2. **App Development**: Work in `excalidraw-app/` for app-specific features
3. **Testing**: Always run `yarn test:update` before committing
4. **Type Safety**: Use `yarn test:typecheck` to verify TypeScript

## Development Commands

```bash
yarn test:typecheck  # TypeScript type checking
yarn test:update     # Run all tests (with snapshot updates)
yarn fix             # Auto-fix formatting and linting issues
```

## Architecture Notes

### Package System

- Uses Yarn workspaces for monorepo management
- Internal packages use path aliases (see `vitest.config.mts`)
- Build system uses esbuild for packages, Vite for the app
- TypeScript throughout with strict configuration

## Agentic tests (concept)

Apex of the pyramid: a subagent validates the **real running app** through tech-agnostic
scenarios, **UI-first**. Two levels:

- **Happy Path (HP)**: curated suite (**at most 3 HP**), core value, under
  `docs/test-scenarios/`. Run + reported at the **integration→develop** MR (human decision).
- **Feature Path (FP)**: **executable** acceptance criteria of a sub-issue (in the issue
  body, **throwaway**). Sub-issue→integration **auto-merge** gate: green FP + no blocking
  finding, on top of build + tests.

Runner: `/agentic-tests`. Format & inventory: the `agentic-tests` skill's `SCENARIO-FORMAT.md`.

## Dev workflow

For a `ready-for-agent` issue: branch per Git flow, then implement with `/tdd`
(red → green → refactor) on the lower pyramid tiers. **After a `/tdd` implementation, propose
to the user to spawn a subagent that runs `/agentic-tests`** on the issue's Feature Path — the
subagent drives the running app (UI-first) and reports findings, so validation is an actual
step, not just a suggestion. Iterate `/tdd` ↔ `/agentic-tests` until build + tests + FP are
green with no blocking finding, then merge per Git flow.

This subagent step is the **baseline** — it leverages Claude Code subagents. Building richer
orchestrations on top (parallel/adversarial reviewers, several FPs, dedicated workflow tooling)
is encouraged.

## Git flow

Simplified vanilla git flow (`main`/`develop`/`integration/*`/`feature/*`/`hotfix/*`, no
`release` until pre-prod). Every Claude instance must know it:

@.claude/skills/git-flow/SKILL.md

## Agent skills

### Business backlog
User stories tenues à la main dans `docs/backlog-metier.md`. See `docs/agents/business-backlog.md`.

### Technical backlog (issue tracker)
GitHub Issues du fork `Loulen/excalidraw` (`gh`). See `docs/agents/issue-tracker.md`.

### Triage labels
Noms canoniques par défaut. See `docs/agents/triage-labels.md`.

### Domain docs
Single-context (`CONTEXT.md` + `docs/adr/` à la racine). See `docs/agents/domain.md`.
