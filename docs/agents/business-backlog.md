# Business backlog

The **business** backlog carries the project's **user stories**. It is managed by humans
(PO / team); agents **read** it to start a design session and **post back** a traceability link
once the technical issues are created. It is the upstream source of the pipeline ("Understand
the need").

> Distinct from the **technical backlog** (`docs/agents/issue-tracker.md`), which is by and for
> agents. N business issues ≠ N technical issues: one story can yield several technical issues,
> or several stories can collapse into one.

## Tool

Tool: **markdown file**, hand-managed in the repo. No external API: reading, commenting and
state changes are plain file edits.

- **Access / tool**: Read / Edit tools (local file, no CLI/MCP needed)
- **Location**: `docs/backlog-metier.md` at the repo root
- **Auth**: none (versioned file)

## Agent queue (story selection)

The agent does **not** pick at random: a human **selects** the stories to work on upstream by
setting their `Statut` line in `docs/backlog-metier.md`. The agent only picks stories marked
ready to design.

- **Where the agent picks**: a user story whose `Statut` is `**à concevoir**`
- **Transition at start**: `à concevoir` → `en conception`
  (trigger when: grilling done + story selected + technical counterpart created)
- **Transition to review**: `en conception` → `en revue` (when the PR opens)

## Commands / gestures

```
# READ a story:        read docs/backlog-metier.md and locate the US-<n> section
# COMMENT on a story:   append a "Traçabilité" note under the US (PRD link, issue numbers, PR link)
# MOVE / change state:  edit the "Statut :" line of the US
```

## Link to the technical backlog

Keep the **business reference** (the `US-<n>` id) in the PRD / technical issues, for two-way
traceability.

    business backlog (US selected by a human in docs/backlog-metier.md)
      └─ /grill-with-docs   → CONTEXT.md + ADRs   (on integration/<business-ref>-<slug>)
          └─ /to-prd        → PRD on the technical backlog (GitHub issue)
              └─ /to-issues → technical issues + back-note on the US in docs/backlog-metier.md
                  └─ implementation (see git-flow)
