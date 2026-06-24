# Excalidraw

Excalidraw est un éditeur de schémas à main levée. Ce CONTEXT.md est renseigné au fil
des sessions de grilling, US par US (scope ciblé), et sert de référence de domaine pour
le pipeline (to-prd, to-issues, tdd, triage).

## Language

### Épaisseur de trait (US-1)

**Épaisseur de trait** (_stroke width_) :
Propriété numérique d'un élément qui détermine la largeur de son tracé. Déjà stockée
comme un nombre libre sur chaque élément (`strokeWidth: number`) — ce n'est pas une
énumération côté donnée.
_Avoid_: graisse, weight (réservé au texte).

**Preset d'épaisseur** (_stroke width preset_) :
Largeur nommée sélectionnable en un clic. Trois presets existants : `thin` (1),
`medium` (2), `bold` (4). Représentés en interne par une **clé de preset**
(`StrokeWidthKey`), pas par leur valeur.
_Avoid_: niveau, palier.

**Épaisseur personnalisée** (_custom stroke width_) :
Valeur numérique d'épaisseur choisie librement, hors des trois presets. Objet de l'US-1.
Bornée à `[0.5, 32]` pas `0.5` côté UI (slider + input, hard-clampés).

**Valeur nominale / valeur effective** :
La **nominale** est celle affichée dans l'UI et stockée pour les formes (thin=1, medium=2,
bold=4). La **effective** est celle réellement portée par l'élément : identique à la nominale
sauf pour le **freedraw**, rendu à la **moitié** (perfect-freehand interprète la largeur
autrement que roughjs). Conversion par `nominalToActual` / `actualToNominal` — presets ET
custom suivent la même règle ½.
_Avoid_: parler de « la » largeur sans préciser laquelle pour le freedraw.

## Relationships

- Un **élément** a exactement une **épaisseur de trait** (un nombre).
- Une **épaisseur de trait** correspond à un **preset** si sa valeur égale celle d'un
  preset, sinon c'est une **épaisseur personnalisée**.
- L'épaisseur du **prochain tracé** est portée par l'app state. US-1 la fait passer d'une
  **clé de preset** (`currentItemStrokeWidthKey`) à un **nombre** (`currentItemStrokeWidth`,
  en valeur **nominale**) : les presets deviennent du sucre qui posent 1/2/4 (cf.
  [ADR-0001](docs/adr/0001-custom-stroke-width-nominal-number-in-appstate.md)).
- Le contrôle d'épaisseur reflète la sélection : un élément sur un preset le surligne ; un
  élément **personnalisé** ne surligne aucun preset (le slider montre sa valeur) ; une
  **sélection multiple** à largeurs différentes laisse le contrôle **vide** (indéterminé), et
  l'édition applique la valeur à toute la sélection.

## Example dialogue

> **Dev :** « L'épaisseur personnalisée, c'est un nouveau type de donnée ? »
> **Expert :** « Non — l'élément stocke déjà un nombre libre. Les presets ne sont qu'une
> commodité d'UI. L'US-1 expose ce qui existe déjà dans la donnée. »
> **Dev :** « Et si je règle 6 puis je dessine au freedraw, l'élément stocke 6 ? »
> **Expert :** « Il stocke 3 : 6 est la valeur **nominale**, le freedraw est rendu à la
> moitié — exactement comme les presets. Le slider, lui, te réaffichera 6. »

## Flagged ambiguities

- « épaisseur » côté UI désignait jusqu'ici une **clé de preset** (thin/medium/bold) ;
  côté donnée c'est un **nombre**. L'US-1 réduit cet écart en exposant le nombre.
