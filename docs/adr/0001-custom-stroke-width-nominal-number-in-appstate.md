# Épaisseur de trait personnalisée : nombre nominal en app state, presets devenus du sucre

## Contexte

US-1 demande de choisir une épaisseur de trait précise au-delà des 3 presets (thin=1,
medium=2, bold=4). Côté donnée, `strokeWidth` est **déjà** un nombre libre sur chaque
élément : il n'y a pas de migration de scène. Le verrou est l'app state, qui porte
l'épaisseur du *prochain tracé* sous forme de **clé de preset** (`currentItemStrokeWidthKey:
StrokeWidthKey`). Le codebase avait justement migré _nombre → clé_ (cf. bloc `// legacy`
dans `data/restore.ts`) parce que la même intention ("medium") doit se résoudre en **2 pour
une forme mais 1 pour le freedraw** (½ de `FREEDRAW_STROKE_WIDTH`) : la clé diffère cette
résolution par type d'élément au moment de la création.

## Décision

On remplace `currentItemStrokeWidthKey: StrokeWidthKey` par **`currentItemStrokeWidth:
number`**, stockant la valeur **nominale**. Les 3 presets deviennent du sucre d'UI qui posent
simplement 1/2/4. Le ½ du freedraw est confiné à **un seul endroit** (la création
d'élément), via deux convertisseurs `nominalToActual(type, n)` / `actualToNominal(type, w)`
par lesquels passent **et** les presets **et** les valeurs personnalisées (même règle ½).

L'UI (slider + input numérique, bornés `[0.5, 32]` pas `0.5`, hard-clamp) travaille toujours
en nominal. Un élément dont la valeur tombe sur un preset surligne ce preset ; sinon aucun
preset n'est surligné et le slider montre la valeur. Sélection multiple à largeurs
différentes : contrôle vide (indéterminé), l'édition applique la valeur à toute la sélection.

Ce fork de dojo **ne vise pas la compat upstream**, ce qui lève la principale objection à A.

## Options considérées

- **A (retenue)** : un seul nombre nominal en app state. Source de vérité unique, lectures
  uniformes (moins de branches), "custom" cesse d'être un cas spécial. Coût : une migration
  `restore` (clé → nombre), divergence assumée vs le design upstream à base de clé.
- **B** : garder la clé + ajouter `currentItemStrokeWidthKey: StrokeWidthKey | "custom"` et
  `currentItemCustomStrokeWidth: number`. Plus proche d'upstream et migration purement
  additive, mais deux champs qui peuvent se désynchroniser ("la clé dit medium, le custom dit
  6 — qui gagne ?") et du branchement partout où la largeur est lue. **Repli** si, à
  l'implémentation, le blast-radius de A déborde le cycle.
- **C** : surcharger un seul champ `StrokeWidthKey | number`. Compact mais le nom du champ
  ment et le narrowing TS pollue tous les points de lecture.

## Conséquences

- Migration `restore` à inverser/adapter (le sens _nombre → clé_ du bloc legacy existant
  prouve que l'équipe migre ce champ ; on fait l'inverse, clé → nombre).
- `getStrokeWidthByKey` reste utile pour résoudre les presets ; on ajoute les deux
  convertisseurs nominal↔actual à côté.
- Export et rendu : aucun changement (consomment déjà `element.strokeWidth` numérique).
