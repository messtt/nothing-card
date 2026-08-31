# Nothing Cards for Home Assistant

Un jeu de cartes Lovelace inspiré de l'esthétique Nothing OS : matrice de points, noir profond, blanc cassé, un seul rouge. Aucune dépendance à l'exécution — **un seul fichier** à déposer dans `www/`.

![Style](https://img.shields.io/badge/style-dot--matrix-E01F26) ![Dependencies](https://img.shields.io/badge/runtime%20deps-none-000) ![License](https://img.shields.io/badge/license-MIT-000)

---

## Les cartes

| Carte | Type YAML | Ce qu'elle fait |
|---|---|---|
| **Button** | `custom:nothing-button-card` | Bouton on/off en pilule, carré ou cercle. Appui court / appui long configurables. |
| **Stats** | `custom:nothing-stats-card` | Histogramme en LED alimenté par le recorder, avec variation sur la période. |
| **Light** | `custom:nothing-light-card` | Contrôle complet d'une lumière : luminosité, roue de couleur, température de blanc. |

Les trois cartes sont livrées dans le même fichier : une seule ressource à déclarer.

La typographie en matrice de points est dessinée en SVG à partir d'une police 5×7 embarquée : rien à installer côté client, et le rendu est identique sur tous les appareils.

---

## Installation

### HACS (dépôt personnalisé)

1. HACS → ⋮ → **Dépôts personnalisés**
2. URL du dépôt, catégorie **Lovelace**
3. Installer *Nothing Cards*, puis rechargement forcé du navigateur (`Ctrl` + `F5`)

### Manuelle

1. Télécharger `nothing-card.js` depuis la dernière *release* (ou `dist/nothing-card.js` du dépôt) et le copier dans `<config>/www/`
2. **Paramètres → Tableaux de bord → ⋮ → Ressources → Ajouter une ressource**
   URL `/local/nothing-card.js` — type **Module JavaScript**
3. Rechargement forcé du navigateur (`Ctrl` + `F5`)

> Le menu Ressources n'apparaît que si le **mode avancé** est activé sur votre profil utilisateur.

---

## Nothing Button Card

```yaml
type: custom:nothing-button-card
entity: light.salon
shape: pill        # pill | square | circle
variant: dark      # apparence à l'état éteint : dark | light
```

| Option | Défaut | Description |
|---|---|---|
| `entity` | — | **Requis.** N'importe quel domaine actionnable. |
| `name` | nom convivial | Libellé affiché. |
| `icon` | icône du domaine | Icône MDI. |
| `shape` | `pill` | `pill`, `square` ou `circle`. |
| `variant` | `dark` | Apparence éteinte : anthracite ou blanc cassé. |
| `dots` | `true` | Typographie en matrice de points. |
| `show_state` / `show_icon` / `led` | `true` | Sous-titre d'état, pastille d'icône, témoin lumineux. |
| `accent` | `#E01F26` | Couleur de l'état allumé. |
| `tap_action` / `hold_action` | `toggle` / `more-info` | Actions standard Lovelace. |

Le basculement s'adapte au domaine : `scene`, `script`, `button`, `lock`, `cover` et `media_player` reçoivent le bon service au lieu d'un `homeassistant.toggle` générique.

---

## Nothing Stats Card

```yaml
type: custom:nothing-stats-card
entity: sensor.consommation_maison
period: hour
points: 24
```

| Option | Défaut | Description |
|---|---|---|
| `entity` | — | **Requis.** Capteur numérique. |
| `period` | `hour` | `5minute`, `hour`, `day`, `week`, `month`. |
| `points` | `24` | Nombre de colonnes (4 → 64). |
| `rows` | `8` | Hauteur maximale de la matrice (3 → 16). |
| `stat` | `mean` | `mean`, `max`, `min`, `sum`, `change`, `state`. |
| `value` | `state` | Ce qu'affiche le grand chiffre. |
| `baseline` | `min` | `min` zoome sur la plage, `zero` part de zéro. |
| `prefix` / `unit` / `decimals` | — | Mise en forme du chiffre. |
| `accent` / `up_color` / `down_color` | rouge / vert / rouge | Couleurs de la matrice et de la variation. |
| `labels` / `delta` / `dots` | `true` | Étiquettes de temps, variation, typographie à points. |

La carte interroge d'abord `recorder/statistics_during_period` (statistiques long terme) et bascule automatiquement sur l'historique brut, qu'elle agrège elle-même, pour les entités sans `state_class`. Rafraîchissement toutes les 5 minutes, plus à chaque changement d'état, bridé à une requête par minute.

Le nombre de lignes de LED s'adapte à la hauteur réellement disponible : la matrice remplit la tuile sans jamais la faire déborder, et les points restent ronds.

---

## Nothing Light Card

```yaml
type: custom:nothing-light-card
entity: light.salon
```

| Option | Défaut | Description |
|---|---|---|
| `entity` | — | **Requis.** Entité `light.*`. |
| `name` | nom convivial | Libellé affiché. |
| `wheel_max` | `220` | Diamètre maximal de la roue, en pixels. |
| `tint` | `true` | La jauge prend la couleur réelle de la lampe. |
| `presets` | `true` | Rangée de raccourcis couleur / blanc. |
| `min_brightness` | `1` | Luminosité minimale atteignable au glisser. |
| `accent` | `#E01F26` | Couleur de repli quand `tint` est désactivé. |
| `dots` | `true` | Typographie en matrice de points. |

Les onglets ne s'affichent que pour ce que la lampe sait faire, d'après `supported_color_modes` : une ampoule simplement dimmable n'affiche que la grande pilule, une ampoule blanc réglable n'a pas de roue. Le rendu est optimiste et les appels de service sont limités à un toutes les 180 ms, avec envoi final au relâchement — l'interface suit le doigt sans saturer le bus.

---

## Notes

- **Dimensionnement** — chaque carte expose `getGridOptions()` pour la vue *sections* et ne déborde jamais de sa tuile, quelle que soit la taille demandée.
- **Éditeur graphique** — les trois cartes fournissent `getConfigForm()` : elles se configurent à la souris, sans passer par le YAML.
- **Accents** — la police 5×7 ne comporte pas de caractères accentués (`É` devient `E`). Utilisez `dots: false` pour un rendu typographique classique.
- **Police NDot** — si la police *NDot 55* est installée sur l'appareil, les textes hors matrice l'utilisent automatiquement.

---

## Développement

Les sources vivent dans `src/`, découpées par carte, et sont assemblées en un
bundle unique par Rollup.

```bash
npm install
npm run build      # dist/nothing-card.js
npm run preview    # banc d'essai sans Home Assistant
```

Voir [DEVELOPERS.md](DEVELOPERS.md) pour la carte de l'arborescence et la marche
à suivre pour ajouter une carte.

## Licence

MIT.
