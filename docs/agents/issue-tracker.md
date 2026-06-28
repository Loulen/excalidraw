# Issue tracker: GitLab (ton fork)

PRDs et issues techniques de ce repo vivent comme **issues GitLab** sur **ton propre fork** du
projet du dojo (`gitlab.ippon.fr`, visibilité *interne*). Le pipeline de conception
(`/to-prd`, `/to-issues`) **crée** les issues ici : tu sens le flux sur un tracker que tu
possèdes, sans collision avec personne. Utilise le CLI `glab` pour tout.

## ⚠️ Footgun host — à lire en premier

Le host par défaut de `glab` est **gitlab.com**, PAS `gitlab.ippon.fr`. Lance `glab`
**depuis ton clone** : il infère le host depuis le remote git automatiquement. Sinon, exporte
`export GITLAB_HOST=gitlab.ippon.fr`.

## Conventions — cible TON fork (inférence depuis le remote, NE PAS épingler `-R`)

Comme tu as cloné **ton fork**, `glab` infère le projet depuis le remote du clone. Ne passe
**pas** `-R …` : tu veux que les issues soient créées sur ton propre tracker, pas sur celui
d'un autre.

- **Créer une issue** : `glab issue create --title "..." --description "..." --label "lbl1,lbl2" --yes`. Pour un corps multi-lignes, écris la description dans un fichier et passe `--description "$(cat body.md)"`.
- **Lire une issue** : `glab issue view <number> --comments`.
- **Lister les issues** : `glab issue list --all` (ajoute `--label "..."` / `--state opened|closed`).
- **Commenter** : `glab issue note <number> --message "..."`.
- **Ajouter / retirer des labels** : `glab issue update <number> --label "..."` / `--unlabel "..."`.
- **Fermer** : `glab issue close <number>`.

Pour les appels API bruts, `glab api` n'infère **pas** le host depuis le remote du clone :
exporte toujours `GITLAB_HOST=gitlab.ippon.fr` et utilise le chemin URL-encodé
`projects/<ton-namespace>%2Fexcalidraw-dojo`. Passe les champs avec `-F key=value` (string
brute), pas `--input` (→ HTTP 415).

> **Implémentation (Part 1).** La slice de référence (#3) se lit sur le projet **canonique**,
> pas sur ton fork (les forks GitLab ne copient pas les issues) :
> `glab issue view 3 -R gitlab.ippon.fr/llenoir/excalidraw-dojo --comments`.

## Quand une skill dit « publier sur l'issue tracker »

Créer une issue GitLab sur ton fork (voir ci-dessus).

## Quand une skill dit « récupérer le ticket concerné »

Lancer `glab issue view <number> --comments`.
