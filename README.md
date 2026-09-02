# Nothing Cards for Home Assistant

Un jeu de cartes Lovelace inspiré de l'esthétique Nothing OS : matrice de points, noir profond, blanc cassé, un seul
rouge. Aucune dépendance à l'exécution — **un seul fichier** à déposer dans `www/`.

![Style](https://img.shields.io/badge/style-dot--matrix-E01F26) ![Dependencies](https://img.shields.io/badge/runtime%20deps-none-000) ![License](https://img.shields.io/badge/license-MIT-000)

**[Voir les cartes en ligne](https://messtt.github.io/nothing-card/)** — la démonstration tourne sur le vrai bundle,
avec un faux Home Assistant : les cartes y sont cliquables, glissables, et se comportent comme chez vous.

---

## Les cartes

| Carte      | Type YAML                    | Ce qu'elle fait                                                                     |
|------------|------------------------------|-------------------------------------------------------------------------------------|
| **Button** | `custom:nothing-button-card` | Bouton on/off en pilule, carré ou cercle. Appui court / appui long configurables.   |
| **Stats**  | `custom:nothing-stats-card`  | Histogramme en LED alimenté par le recorder, avec variation sur la période.         |
| **Light**  | `custom:nothing-light-card`  | Lumière en barres empilées : allumage, luminosité, teinte, blanc, raccourcis.       |
| **Media**  | `custom:nothing-media-card`  | Lecteur multimédia : pochette, progression, transport, trois dispositions.           |
| **Info**   | `custom:nothing-info-card`   | Affichage seul : pastille, valeur, libellé. Aucune commande.                        |
| **Text**   | `custom:nothing-text-card`   | Titre en matrice de points, à poser entre deux sections.                            |
| **Slider** | `custom:nothing-slider-card` | Grande barre à glisser. S'adapte au domaine de l'entité.                            |
| **Cover**  | `custom:nothing-cover-card`  | Volet roulant : tablier dessiné, haut / stop / bas, position, inclinaison.           |

Les huit cartes sont livrées dans le même fichier : une seule ressource à déclarer.

La typographie en matrice de points est dessinée en SVG à partir d'une police 5×7 embarquée : rien à installer côté
client, et le rendu est identique sur tous les appareils.

---

## Installation

### HACS (dépôt personnalisé)

1. HACS → ⋮ → **Dépôts personnalisés**
2. URL du dépôt, catégorie **Lovelace**
3. Installer *Nothing Cards*, puis rechargement forcé du navigateur (`Ctrl` + `F5`)

### Manuelle

1. Télécharger `nothing-card.js` depuis la dernière *release* (ou `dist/nothing-card.js` du dépôt) et le copier dans
   `<config>/www/`
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

| Option                             | Défaut                 | Description                                           |
|------------------------------------|------------------------|-------------------------------------------------------|
| `entity`                           | —                      | **Requis.** N'importe quel domaine actionnable.       |
| `name`                             | nom convivial          | Libellé affiché.                                      |
| `icon`                             | icône du domaine       | Icône MDI.                                            |
| `shape`                            | `pill`                 | `pill`, `square` ou `circle`.                         |
| `variant`                          | `dark`                 | Apparence éteinte : anthracite ou blanc cassé.        |
| `dots`                             | `true`                 | Typographie en matrice de points.                     |
| `show_name` / `show_state`         | `true`                 | Libellé et sous-titre d'état.                         |
| `show_icon` / `led`                | `true`                 | Pastille d'icône, témoin lumineux.                    |
| `accent`                           | `#E01F26`              | Couleur de l'état allumé.                             |
| `tap_action` / `hold_action`       | `toggle` / `more-info` | Actions standard Lovelace.                            |

Le basculement s'adapte au domaine : `scene`, `script`, `button`, `lock`, `cover` et `media_player` reçoivent le bon
service au lieu d'un `homeassistant.toggle` générique.

`show_name: false` et `show_state: false` ensemble ne laissent que l'icône, recentrée dans le bouton — un raccourci
carré ou rond, sans un mot.

---

## Nothing Stats Card

```yaml
type: custom:nothing-stats-card
entity: sensor.consommation_maison
period: hour
points: 24
```

| Option                               | Défaut               | Description                                           |
|--------------------------------------|----------------------|-------------------------------------------------------|
| `entity`                             | —                    | **Requis.** Capteur numérique.                        |
| `period`                             | `hour`               | `5minute`, `hour`, `day`, `week`, `month`.            |
| `points`                             | `24`                 | Nombre de colonnes (4 → 64).                          |
| `rows`                               | `8`                  | Hauteur maximale de la matrice (3 → 16).              |
| `stat`                               | `mean`               | `mean`, `max`, `min`, `sum`, `change`, `state`.       |
| `value`                              | `state`              | Ce qu'affiche le grand chiffre.                       |
| `baseline`                           | `min`                | `min` zoome sur la plage, `zero` part de zéro.        |
| `prefix` / `unit` / `decimals`       | —                    | Mise en forme du chiffre.                             |
| `accent` / `up_color` / `down_color` | rouge / vert / rouge | Couleurs de la matrice et de la variation.            |
| `labels` / `delta` / `dots`          | `true`               | Étiquettes de temps, variation, typographie à points. |

La carte interroge d'abord `recorder/statistics_during_period` (statistiques long terme) et bascule automatiquement sur
l'historique brut, qu'elle agrège elle-même, pour les entités sans `state_class`. Rafraîchissement toutes les 5 minutes,
plus à chaque changement d'état, bridé à une requête par minute.

Le nombre de lignes de LED s'adapte à la hauteur réellement disponible : la matrice remplit la tuile sans jamais la
faire déborder, et les points restent ronds.

---

## Nothing Light Card

```yaml
type: custom:nothing-light-card
entity: light.salon
```

| Option                                   | Défaut        | Description                                        |
|------------------------------------------|---------------|----------------------------------------------------|
| `entity`                                 | —             | **Requis.** Entité `light.*`.                      |
| `name`                                   | nom convivial | Libellé affiché.                                   |
| `tint`                                   | `true`        | Les barres prennent la couleur réelle de la lampe. |
| `min_brightness`                         | `1`           | Luminosité minimale atteignable au glisser.        |
| `accent`                                 | `#E01F26`     | Couleur de repli quand `tint` est désactivé.       |
| `dots`                                   | `true`        | Pourcentage en matrice de points.                  |
| `show_icon` / `show_name` / `show_value` | `true`        | Les trois morceaux de l'en-tête, séparément.       |
| `toggle`                                 | `true`        | Barre d'interrupteur.                              |
| `brightness`                             | `true`        | Barre de luminosité.                               |
| `color`                                  | `true`        | Bande de teintes.                                  |
| `white`                                  | `true`        | Bande de température de blanc.                     |
| `presets`                                | `true`        | Rangée de raccourcis couleur / blanc.              |

La carte est une pile de barres, sans onglet : un **interrupteur** dont le pavé glisse d'un bord à l'autre, la
**luminosité**, la **teinte**, le **blanc**, puis la rangée de **raccourcis**.

Chaque élément se coupe séparément, et la tuile se redimensionne toute seule : `getGridOptions()` mesure ce qui reste
réellement à afficher. Une barre disparaît soit parce que `supported_color_modes` ne l'annonce pas, soit parce que vous
l'avez mise à `false`.

```yaml
# une lampe réduite à son interrupteur et sa luminosité
type: custom:nothing-light-card
entity: light.salon
show_icon: false
show_name: false
show_value: false
color: false
white: false
presets: false
```

| Configuration                                   | Rangées de grille |
|-------------------------------------------------|-------------------|
| RGBWW complète                                  | 6 (376 px)        |
| RGBWW sans teinte ni blanc                      | 4 (248 px)        |
| Ampoule simplement dimmable                     | 3 (184 px)        |
| Deux barres seules, sans en-tête (ci-dessus)    | 2 (120 px)        |

La bande de teintes couvre les 360 degrés à saturation pleine : elle donne des couleurs franches, et les raccourcis
apportent les teintes plus douces et les blancs. Les quatre premiers raccourcis sont des températures (2000, 2700,
4000 et 6500 K), les quatre suivants des couleurs ; seuls ceux que la lampe sait rendre sont affichés.

Le rendu est optimiste et les appels de service sont limités à un toutes les 180 ms, avec envoi final au relâchement —
l'interface suit le doigt sans saturer le bus.

> L'option `wheel_max` des versions précédentes n'a plus d'effet : la roue de couleur a laissé place à la bande de
> teintes. Une configuration qui la mentionne encore reste valide.

---

## Nothing Media Card

```yaml
type: custom:nothing-media-card
entity: media_player.salon
layout: bar        # bar | tile | art
```

| Option                       | Défaut                    | Description                                               |
|------------------------------|---------------------------|-----------------------------------------------------------|
| `entity`                     | —                         | **Requis.** Entité `media_player.*`.                      |
| `name`                       | nom convivial             | Libellé affiché quand rien n'est en cours.                |
| `layout`                     | `bar`                     | `bar`, `tile` ou `art`.                                   |
| `variant`                    | `dark`                    | Fond anthracite ou blanc cassé.                           |
| `art`                        | `true`                    | Pochette — note en matrice de points à défaut.            |
| `controls`                   | `true`                    | Précédent / lecture / suivant.                            |
| `progress` / `times`         | `true`                    | Barre de progression, position et durée.                  |
| `volume`                     | `false`                   | Rangée de volume avec coupure du son.                     |
| `dots`                       | `true`                    | Compteurs en matrice de points.                           |
| `accent`                     | `#E01F26`                 | Couleur de la lecture et de la progression.               |
| `tap_action` / `hold_action` | `more-info` / `more-info` | Actions sur la pochette et les titres.                    |

Les trois dispositions reprennent les widgets Nothing : **`bar`** est la pilule large — pochette, titres et progression
à gauche, transport à droite ; **`tile`** est la tuile carrée, pochette en haut et commandes en bas ; **`art`** étale la
pochette en fond, texte et pilule rouge posés dessus.

Chaque bouton n'apparaît que si le lecteur annonce l'action dans `supported_features` : pas de flèche « suivant » sur
une radio, pas de curseur de volume sur un lecteur qui n'en a pas. La barre ne devient glissable que si le lecteur sait
chercher (`SEEK`), avec un appel toutes les 180 ms au plus et l'envoi final au relâchement.

`media_position` est figé au dernier changement d'état : la carte extrapole la position une fois par seconde pendant la
lecture, ce qui fait avancer la barre sans réveiller Home Assistant. Les séries affichent le titre de la série puis la
saison et l'épisode ; la musique affiche le titre puis l'artiste.

---

## Nothing Info Card

La carte qui ne fait qu'afficher : une pastille, une valeur, un libellé. Pas de bouton, pas de curseur.

```yaml
type: custom:nothing-info-card
entity: sensor.temperature_bureau
```

| Option                       | Défaut                | Description                                                    |
|------------------------------|-----------------------|----------------------------------------------------------------|
| `entity`                     | —                     | **Requis.** N'importe quel domaine.                            |
| `name`                       | nom convivial         | Libellé sous la valeur.                                        |
| `icon`                       | icône de l'entité     | Icône MDI de la pastille.                                      |
| `attribute`                  | —                     | Affiche un attribut plutôt que l'état.                         |
| `layout`                     | `bar`                 | `bar`, `tile` ou `pill`.                                       |
| `variant`                    | `dark`                | Fond anthracite ou blanc cassé.                                |
| `badge`                      | `filled`              | `filled` (pastille rouge), `plain` (icône seule), `none`.      |
| `unit` / `decimals`          | ceux de l'entité      | Remplacent l'unité et l'arrondi.                               |
| `dots`                       | `true`                | Valeur en matrice de points.                                   |
| `show_value` / `show_name`   | `true`                | Masquer l'un ou l'autre.                                       |
| `accent`                     | `#E01F26`             | Couleur de la pastille.                                        |
| `tap_action` / `hold_action` | `more-info` / `none`  | Actions standard Lovelace.                                     |

`bar` tient sur une rangée de grille : pastille à gauche, valeur puis libellé à droite. `tile` empile le tout dans un
carré, valeur en grand. `pill` centre le groupe dans une pilule très arrondie — avec `show_value: false` et
`badge: plain`, c'est le raccourci d'application des widgets Nothing.

Une valeur numérique est mise en forme selon la locale de Home Assistant (`26.0` devient `26,0`) ; un état textuel
passe par sa traduction (`on` devient `Allumé`). La police à points ne connaissant que les majuscules non accentuées,
`dots: false` convient mieux aux états en toutes lettres.

---

## Nothing Text Card

Un titre, rien d'autre. C'est la seule carte du lot qui n'observe aucune entité : son contenu vient de la configuration.

```yaml
type: custom:nothing-text-card
text: Salon
subtitle: 6 appareils
rule: true
```

| Option                       | Défaut           | Description                                                       |
|------------------------------|------------------|-------------------------------------------------------------------|
| `text`                       | —                | **Requis.** Le titre. Un saut de ligne fait une ligne de plus.    |
| `subtitle`                   | —                | Ligne secondaire, toujours en typographie ordinaire.              |
| `align`                      | `left`           | `left`, `center` ou `right`.                                      |
| `size`                       | `md`             | `sm`, `md` ou `lg`.                                               |
| `variant`                    | `none`           | `none` (transparent), `dark`, `light` ou `accent`.                |
| `color`                      | couleur du thème | Couleur du texte.                                                 |
| `accent`                     | `#E01F26`        | Fond de la variante `accent`.                                     |
| `dots`                       | `true`           | Matrice de points, sinon typographie ordinaire.                   |
| `rule`                       | `false`          | Filet pointillé sous le titre.                                    |
| `tap_action` / `hold_action` | `none`           | Sans action configurée, la carte ne reçoit aucun écouteur.        |

En `variant: none` — le défaut — la carte est transparente et prend la couleur de texte du thème : elle se pose entre
deux sections comme un intertitre, et reste lisible sur un tableau de bord clair comme sombre. Les autres variantes en
font une vraie tuile pleine.

`getGridOptions()` mesure le contenu (lignes, sous-titre, filet, rembourrage) et ne demande que les rangées
nécessaires : une pour un titre simple, deux dès qu'il y a un sous-titre en grande taille.

Deux réserves sur la police à points : elle ne connaît que les majuscules non accentuées (`É` devient `E`), et un titre
long finit par se réduire pour tenir dans la largeur. Pour une phrase entière, `dots: false` reste plus lisible.

---

## Nothing Slider Card

```yaml
type: custom:nothing-slider-card
entity: light.salon
```

| Option                       | Défaut                    | Description                                             |
|------------------------------|---------------------------|---------------------------------------------------------|
| `entity`                     | —                         | **Requis.** Un domaine réglable (voir plus bas).        |
| `name` / `icon`              | ceux de l'entité          | Libellé et icône de la pastille.                        |
| `layout`                     | `bar`                     | `bar` (en-tête + barre) ou `compact` (barre seule).     |
| `variant`                    | `dark`                    | Fond anthracite ou blanc cassé.                         |
| `tint`                       | `true`                    | La jauge prend la couleur réelle de la lampe.           |
| `min` / `max` / `step`       | ceux de l'entité          | Bornes et pas, quand ceux de l'entité ne conviennent pas. |
| `unit`                       | celle de l'entité         | Remplace l'unité affichée.                              |
| `dots`                       | `true`                    | Valeur en matrice de points.                            |
| `show_icon` / `show_name` / `show_value` | `true`        | Masquer l'un ou l'autre.                                |
| `accent`                     | `#E01F26`                 | Couleur de la jauge, quand `tint` ne s'applique pas.    |
| `tap_action` / `hold_action` | `more-info` / `more-info` | Actions sur le libellé.                                 |

Ce que le curseur règle dépend du domaine, et la carte va chercher les bornes au bon endroit :

| Domaine                  | Ce qui est réglé      | Service appelé                 | Bornes                                  |
|--------------------------|-----------------------|--------------------------------|-----------------------------------------|
| `light`                  | Luminosité            | `light.turn_on`                | 1 – 100 %                               |
| `fan`                    | Vitesse               | `fan.set_percentage`           | 0 – 100 %, au pas de `percentage_step`  |
| `cover`                  | Ouverture             | `cover.set_cover_position`     | 0 – 100 %                               |
| `media_player`           | Volume                | `media_player.volume_set`      | 0 – 100 %                               |
| `number`, `input_number` | Valeur                | `<domaine>.set_value`          | `min`, `max`, `step` de l'entité        |
| `climate`                | Consigne              | `climate.set_temperature`      | `min_temp`, `max_temp`, `target_temp_step` |

Tout autre domaine est refusé à la configuration, avec un message qui dit lesquels sont acceptés.

Un appui sur la **pastille** bascule l'entité, un appui sur le **libellé** ouvre sa fiche, et la **barre** se glisse.
Le rendu est optimiste et les appels de service sont limités à un toutes les 180 ms, avec envoi final au relâchement :
l'interface suit le doigt sans saturer le bus. La valeur est ramenée sur le pas de l'entité — un ventilateur au pas de
10 s'arrête sur 40, jamais sur 44.

`layout: compact` réduit la carte à la barre elle-même, pastille à gauche et pourcentage à droite posés dessus : la
pilule des widgets Nothing, sur une seule rangée de grille.

---

## Nothing Cover Card

```yaml
type: custom:nothing-cover-card
entity: cover.volet_salon
```

| Option                       | Défaut                    | Description                                          |
|------------------------------|---------------------------|------------------------------------------------------|
| `entity`                     | —                         | **Requis.** Entité `cover.*`.                        |
| `name` / `icon`              | ceux de l'entité          | Libellé et icône de la pastille.                     |
| `variant`                    | `dark`                    | Fond anthracite ou blanc cassé.                      |
| `dots`                       | `true`                    | Position en matrice de points.                       |
| `show_icon` / `show_name` / `show_value` | `true`        | Les trois morceaux de l'en-tête, séparément.         |
| `shutter`                    | `true`                    | Le tablier dessiné.                                  |
| `buttons`                    | `true`                    | Colonne haut / stop / bas.                           |
| `slider`                     | `true`                    | Curseur de position.                                 |
| `tilt`                       | `true`                    | Curseur d'inclinaison des lamelles.                  |
| `accent`                     | `#E01F26`                 | Couleur du remplissage et des flèches en mouvement.  |
| `tap_action` / `hold_action` | `more-info` / `more-info` | Actions sur le libellé.                              |

**Le tablier est dessiné, pas photographié** : un cadre, du vitrage en trame de points, et des lamelles en traits fins
qui descendent du haut. Sa hauteur suit `current_position` — 30 % d'ouverture, 70 % de tablier. Pendant un mouvement,
la flèche concernée passe au rouge et le tablier respire.

Quand le moteur gère l'inclinaison, **l'épaisseur des lamelles la reproduit** : refermées elles se touchent et le volet
devient opaque, à plat elles laissent passer le jour entre deux traits. Le second curseur les règle.

Chaque bouton n'apparaît que si `supported_features` l'annonce, et chaque élément se coupe dans la config. Sans le
tablier, la colonne de boutons se met à l'horizontale et la carte tient sur deux rangées de grille.

| Configuration                                   | Rangées de grille |
|-------------------------------------------------|-------------------|
| Volet à lamelles orientables, tout affiché      | 5 (312 px)        |
| Volet roulant avec position                     | 4 (248 px)        |
| Boutons seuls, sans tablier ni position         | 2 (120 px)        |

Le rendu est optimiste et les appels de service sont limités à un toutes les 180 ms, avec envoi final au relâchement.

---

## Notes

- **Dimensionnement** — chaque carte expose `getGridOptions()` pour la vue *sections* et ne déborde jamais de sa tuile,
  quelle que soit la taille demandée.
- **Éditeur graphique** — les huit cartes fournissent `getConfigForm()` : elles se configurent à la souris, sans passer
  par le YAML.
- **Pictogrammes** — les commandes internes des cartes (flèches, lecture, pause, volume) sont dessinées en matrice de
  points, sur la même trame que la typographie. Seules les icônes d'entité restent des icônes MDI : c'est vous qui les
  choisissez, l'inventaire ne peut pas être fermé.
- **Accents** — la police 5×7 ne comporte pas de caractères accentués (`É` devient `E`). Utilisez `dots: false` pour un
  rendu typographique classique.
- **Police NDot** — si la police *NDot 55* est installée sur l'appareil, les textes hors matrice l'utilisent
  automatiquement.

---

## Développement

Les sources vivent dans `src/`, découpées par carte, et sont assemblées en un bundle unique par Rollup.

```bash
npm install
npm run build      # dist/nothing-card.js
npm run preview    # banc d'essai sans Home Assistant, sur http://localhost:8137/
```

Le banc d'essai est la page `index.html` à la racine, servie telle quelle par GitHub Pages : c'est la même que la
démonstration en ligne.

Voir [DEVELOPERS.md](DEVELOPERS.md) pour la carte de l'arborescence et la marche à suivre pour ajouter une carte.

## Licence

MIT.
