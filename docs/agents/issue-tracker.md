# Issue tracker: GitLab (Ippon)

Issues and PRDs for this repo live as **GitLab issues** on the dojo project
`llenoir/excalidraw-dojo` (host `gitlab.ippon.fr`, *internal* visibility → readable by
anyone at Ippon). Use the `glab` CLI for all operations.

## ⚠️ Host gotcha — read this first

`glab`'s default host is **gitlab.com**, NOT `gitlab.ippon.fr`. Two ways to hit the right host:

- **Run `glab` from inside a clone of this repo** — it infers the host from the `gitlab`
  git remote automatically. This is the normal case for skills working in the checkout.
- Otherwise pin the repo on every command: `-R gitlab.ippon.fr/llenoir/excalidraw-dojo`
  (or `export GITLAB_HOST=gitlab.ippon.fr`).

**Reads must target the canonical project.** A colleague who *forked* this repo has their
own, **empty** tracker — GitLab forks do NOT copy issues. So when reading or listing
issues, always pin the canonical project explicitly:
`-R gitlab.ippon.fr/llenoir/excalidraw-dojo`. (The canonical project is internal-visible,
so every Ippon clone/fork can read it.)

## Conventions

All examples pin the canonical project; drop `-R …` only if you are sure the cwd remote
already points at it.

- **Create an issue**: `glab issue create -R gitlab.ippon.fr/llenoir/excalidraw-dojo --title "..." --description "..." --label "lbl1,lbl2" --yes`. For multi-line bodies, write the description to a file and pass `--description "$(cat body.md)"`.
- **Read an issue**: `glab issue view <number> -R gitlab.ippon.fr/llenoir/excalidraw-dojo --comments`.
- **List issues**: `glab issue list -R gitlab.ippon.fr/llenoir/excalidraw-dojo --all` (add `--label "..."` / `--state opened|closed`).
- **Comment on an issue**: `glab issue note <number> -R gitlab.ippon.fr/llenoir/excalidraw-dojo --message "..."`.
- **Apply / remove labels**: `glab issue update <number> -R gitlab.ippon.fr/llenoir/excalidraw-dojo --label "..."` / `--unlabel "..."`.
- **Close**: `glab issue close <number> -R gitlab.ippon.fr/llenoir/excalidraw-dojo`.

For raw API calls, `glab api` does **not** infer the host from the cwd remote — always set
`GITLAB_HOST=gitlab.ippon.fr` and use the URL-encoded path `projects/llenoir%2Fexcalidraw-dojo`.
Pass fields with `-F key=value` (raw string), not `--input` (sends the wrong Content-Type → HTTP 415).

## When a skill says "publish to the issue tracker"

Create a GitLab issue (see above).

## When a skill says "fetch the relevant ticket"

Run `glab issue view <number> -R gitlab.ippon.fr/llenoir/excalidraw-dojo --comments`.
