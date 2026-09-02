# Nothing Cards for Home Assistant

Un jeu de cartes Lovelace inspiré de l'esthétique Nothing OS : matrice de points, noir profond, blanc cassé, un seul
rouge. Aucune dépendance à l'exécution — **un seul fichier** à déposer dans `www/`.

![Style](https://img.shields.io/badge/style-dot--matrix-E01F26) ![Dependencies](https://img.shields.io/badge/runtime%20deps-none-000) ![License](https://img.shields.io/badge/license-MIT-000)
___
**[English](README.md)** · **Français**

View the live cards: https://messtt.github.io/nothing-card/

**[Voir les cartes en ligne](https://messtt.github.io/nothing-card/)** — la démonstration tourne sur le vrai bundle,
avec un faux Home Assistant : les cartes y sont cliquables, glissables, et se comportent comme chez vous.

![Aperçu des cartes](docs/img/preview.png)

---

## Les cartes

| Carte      | Type YAML                    | Ce qu'elle fait                                                                     |
|------------|------------------------------|-------------------------------------------------------------------------------------|
| **Button** | `custom:nothing-button-card` | Bouton on/off en pilule, carré ou cercle. Appui court / appui long configurables.   |
| **Stats**  | `custom:nothing-stats-card`  | Graphique alimenté par le recorder : matrice de LED, traits fins ou courbe.         |
| **Light**  | `custom:nothing-light-card`  | Lumière en barres empilées : allumage, luminosité, teinte, blanc, raccourcis.       |
| **Media**  | `custom:nothing-media-card`  | Lecteur multimédia : pochette, progression, transport, quatre dispositions.          |
| **Info**   | `custom:nothing-info-card`   | Affichage seul : pastille, valeur, libellé. Aucune commande.                        |
| **Text**   | `custom:nothing-text-card`   | Titre en matrice de points, à poser entre deux sections.                            |
| **Slider** | `custom:nothing-slider-card` | Grande barre à glisser. S'adapte au domaine de l'entité.                            |
| **Cover**  | `custom:nothing-cover-card`  | Volet roulant : tablier dessiné, haut / stop / bas, position, inclinaison.           |
| **Battery**| `custom:nothing-battery-card`| Niveau de charge : grand chiffre et jauge en pilule de points.                       |
| **Flow**   | `custom:nothing-flow-card`   | Flux d'énergie : tuiles autour d'un anneau, points lumineux sur les liaisons.        |
| **Clock**  | `custom:nothing-clock-card`  | Heure, jour et date, en cinq dispositions. Aucune entité requise.                    |
| **Thermostat** | `custom:nothing-thermostat-card` | Consigne au doigt sur un cadran gradué, modes et alimentation.           |
| **Weather**| `custom:nothing-weather-card`| Météo en points : conditions, heures, journées. Cinq dispositions.                   |

Les treize cartes sont livrées dans le même fichier : une seule ressource à déclarer.

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

## Options communes

Deux réglages valent pour **toutes les cartes**, en plus de leurs options propres.

| Option       | Défaut  | Description                                                     |
|--------------|---------|-----------------------------------------------------------------|
| `name_dots`  | selon la carte | Écrit le libellé en matrice de points.                   |
| `icon_style` | `mdi`   | `mdi` (icône classique) ou `dots` (pictogramme en points).       |

```yaml
type: custom:nothing-slider-card
entity: light.salon
name_dots: true
icon_style: dots
```

**`name_dots`** n'a pas de valeur fixe par défaut : sans lui, chaque carte garde le rendu qu'elle a toujours eu — les
cartes **button** et **stats** écrivent leur libellé en points (elles suivent alors leur option `dots`), les autres en
typographie ordinaire. Le poser à `true` ou `false` tranche partout de la même façon. La carte **text**, elle, n'en a
pas besoin : son option `dots` fait déjà exactement cela.

**`icon_style: dots`** remplace l'icône d'entité par un pictogramme dessiné sur la même grille 7×7 que les commandes.
L'inventaire est volontairement court — ampoule, alimentation, volet, ventilateur, cadenas, note — et tout domaine non
listé retombe sur le point Nothing. C'est le prix d'un dessin lisible sur sept points de côté : les milliers d'icônes
MDI ne s'y transposent pas. En `mdi`, rien ne change.

## Nothing Button Card

```yaml
type: custom:nothing-button-card
entity: light.salon
shape: pill        # pill | square | circle
variant: dark      # apparence à l'état éteint : dark | light
```

![Carte button](docs/img/button_example.png)

![Formes carrée et ronde](docs/img/button_square_circle_exemple.png)

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
| `chart`                              | `matrix`             | `matrix`, `bars` ou `line`.                           |
| `period`                             | `hour`               | `5minute`, `hour`, `day`, `week`, `month`.            |
| `points`                             | `24`                 | Nombre de colonnes (4 → 64).                          |
| `rows`                               | `8`                  | Hauteur maximale de la matrice (3 → 16).              |
| `stat`                               | `mean`               | `mean`, `max`, `min`, `sum`, `change`, `state`.       |
| `value`                              | `state`              | Ce qu'affiche le grand chiffre.                       |
| `baseline`                           | `min`                | `min` zoome sur la plage, `zero` part de zéro.        |
| `prefix` / `unit` / `decimals`       | —                    | Mise en forme du chiffre.                             |
| `accent` / `up_color` / `down_color` | rouge / vert / rouge | Couleurs de la matrice et de la variation.            |
| `labels` / `delta` / `dots`          | `true`               | Étiquettes de temps, variation, typographie à points. |

**Trois styles de graphique.** `matrix` est la matrice de LED d'origine. `bars` pose des traits fins sur la ligne de
base — une valeur au plancher se réduit à son bout arrondi, c'est-à-dire à un point, et la plus haute passe au rouge.
`line` trace une courbe continue et marque la valeur courante d'un point rouge.

```yaml
type: custom:nothing-stats-card
entity: sensor.consommation_maison
chart: bars
points: 48
labels: false
delta: false
```

`bars` et `line` sont dessinés **en pixels**, à l'échelle 1:1 de la boîte mesurée : les traits gardent leur épaisseur
et les bouts restent ronds quelle que soit la tuile. Ils se redessinent au redimensionnement, là où `matrix` adapte
plutôt son nombre de lignes de LED. Montez `points` pour resserrer les traits — 48 ou 64 donnent la trame dense des
widgets.

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

![Carte light](docs/img/light_example.png)

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

![Carte media](docs/img/media_example.png)

![Disposition art](docs/img/media_art_example.png)

| Option                       | Défaut                    | Description                                               |
|------------------------------|---------------------------|-----------------------------------------------------------|
| `entity`                     | —                         | **Requis.** Entité `media_player.*`.                      |
| `name`                       | nom convivial             | Libellé affiché quand rien n'est en cours.                |
| `layout`                     | `bar`                     | `bar`, `wide`, `tile` ou `art`.                           |
| `variant`                    | `dark`                    | Fond anthracite ou blanc cassé.                           |
| `art`                        | `true`                    | Pochette — note en matrice de points à défaut.            |
| `controls`                   | `true`                    | Précédent / lecture / suivant.                            |
| `progress` / `times`         | `true`                    | Barre de progression, position et durée.                  |
| `volume`                     | `false`                   | Rangée de volume avec coupure du son.                     |
| `play_text` / `pause_text`   | `Play` / `Pause`          | Libellé du bouton, en disposition `wide`.                 |
| `dots`                       | `true`                    | Compteurs en matrice de points.                           |
| `accent`                     | `#E01F26`                 | Couleur de la lecture et de la progression.               |
| `tap_action` / `hold_action` | `more-info` / `more-info` | Actions sur la pochette et les titres.                    |

Les quatre dispositions reprennent les widgets Nothing : **`bar`** est la pilule large — pochette, titres et
progression à gauche, transport à droite ; **`wide`** met la pochette en haut à droite, le titre à gauche, et pose en
bas un bouton en pilule libellé avec les pistes en chevrons doubles ; **`tile`** est la tuile carrée, pochette en haut
et commandes en bas ; **`art`** étale la pochette en fond, texte et pilule rouge posés dessus.

En `wide`, la pochette est posée par-dessus la carte, et le bloc de titres **réserve sa hauteur** : tout ce qui suit —
progression, volume — commence donc sous elle, quel que soit le nombre de rangées affichées. La barre garde ainsi
toute la largeur sans jamais passer derrière la pochette, et la tuile réclame une rangée de plus quand le volume est
affiché.

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

![Carte info](docs/img/info_example.png)

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

![Carte text](docs/img/text_example.png)

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

![Carte slider](docs/img/slider_example.png)

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

![Carte cover](docs/img/cover_example.png)

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

## Nothing Battery Card

```yaml
type: custom:nothing-battery-card
entity: sensor.telephone_batterie
```

| Option                       | Défaut                    | Description                                              |
|------------------------------|---------------------------|----------------------------------------------------------|
| `entity`                     | —                         | **Requis.** Capteur de batterie, ou entité qui porte `battery_level`. |
| `name`                       | nom convivial             | Libellé au-dessus du chiffre.                            |
| `attribute`                  | —                         | Attribut à lire plutôt que l'état.                       |
| `charging_entity`            | —                         | Entité qui dit si l'appareil charge.                     |
| `layout`                     | `bar`                     | `bar` (chiffre et jauge côte à côte) ou `tile` (empilés).|
| `variant`                    | `dark`                    | Fond anthracite ou blanc cassé.                          |
| `columns` / `rows`           | `20` / `3`                | Grille de points de la jauge.                            |
| `low`                        | `20`                      | En dessous, le chiffre passe au rouge.                   |
| `unit`                       | `%`                       | Unité à côté du chiffre.                                 |
| `dots`                       | `true`                    | Niveau en matrice de points.                             |
| `show_name` / `show_value` / `show_gauge` | `true`       | Masquer l'un ou l'autre.                                 |
| `accent`                     | `#E01F26`                 | Couleur des points allumés.                              |
| `tap_action` / `hold_action` | `more-info` / `more-info` | Actions standard Lovelace.                               |

Le niveau se lit dans l'ordre où Home Assistant le publie : l'attribut nommé dans la configuration, sinon
`battery_level` — que posent la plupart des intégrations d'appareils —, sinon l'état lui-même pour un capteur
`device_class: battery`.

**Le remplissage ne ment pas.** Une batterie non vide garde au moins une colonne allumée, une batterie non pleine en
laisse au moins une éteinte : à 99 % la jauge affiche 19 colonnes sur 20, jamais 20. C'est ce qui évite de croire une
batterie pleine alors qu'elle ne l'est pas.

**En charge**, un éclair en points s'affiche à côté du chiffre et la jauge respire. L'état vient de `charging_entity`
si vous en donnez une, sinon des attributs `is_charging` ou `battery_state` de l'entité.

---

## Nothing Flow Card

```yaml
type: custom:nothing-flow-card
home:
  entity: sensor.maison_puissance
  energy: sensor.maison_energie
  ring: sensor.autoconsommation      # le pourcentage dans l'anneau
sources:
  - entity: sensor.import_reseau
    name: Import grid
    icon: pylon
    energy: sensor.import_reseau_kwh
  - entity: sensor.solaire
    name: Solaire
    icon: sun
    energy: sensor.solaire_kwh
consumers:
  - entity: sensor.cumulus
    name: Cumulus
    icon: cloud
    slot: ml
  - entity: sensor.voiture
    name: Voiture
    icon: car
  - entity: sensor.frigo
    name: Frigo
    icon: fridge
  - entity: sensor.export_reseau
    name: Export grid
    icon: bolt
```

| Option                    | Défaut       | Description                                                       |
|---------------------------|--------------|-------------------------------------------------------------------|
| `sources` / `consumers`   | —            | **Au moins une entrée.** Les listes de tuiles, avant et après le centre. |
| `home`                    | —            | `{entity, energy, ring, icon}` du centre. Sans `entity`, la somme des sources. |
| `max_power`               | `3000`       | Puissance considérée comme « pleine vitesse ».                    |
| `speed`                   | `1`          | Vitesse des points : `2` va deux fois plus vite, `0.5` deux fois moins. |
| `dots_per_line`           | `2`          | Points en vol sur chaque liaison.                                 |
| `ring_dots`               | `56`         | Points de l'anneau central.                                       |
| `decimals` / `energy_decimals` | `0` / `1` | Arrondi des puissances et des énergies.                          |
| `variant`                 | `dark`       | Fond anthracite ou blanc cassé.                                   |
| `dots`                    | `true`       | Valeurs en matrice de points.                                     |
| `footer` / `footer_text`  | `true` / vide | Le pied de carte et le texte libre à gauche de l'heure.           |
| `accent`                  | `#E01F26`    | Couleur des points qui circulent.                                 |

Chaque tuile prend `entity` (la puissance), et facultativement `name`, `icon`, `energy` (la ligne en kWh) et `slot`.
Les emplacements sont `tl`, `tr`, `ml`, `mr`, `bl`, `bc`, `br` — sept au maximum autour du centre. Sans `slot`, les
sources se placent en haut puis à gauche, les consommateurs en bas puis à droite.

**Les icônes sont des pictogrammes en points** : `pylon`, `sun`, `house`, `car`, `fridge`, `cloud`, `bolt`, `plug`,
`battery`… Un nom préfixé `mdi:` bascule sur l'icône classique correspondante.

**L'animation.** Un point lumineux part de la source et parcourt la liaison jusqu'à sa destination. Sa vitesse suit la
puissance, sur une échelle logarithmique — sans quoi 10 W et 3000 W donneraient deux animations impossibles à
distinguer. En dessous de 1 W, la liaison est considérée comme inactive et les points s'effacent.

`speed` règle l'allure d'ensemble sans toucher aux écarts entre liaisons : à `2`, toutes les durées sont divisées par
deux, et la plus grosse puissance reste la plus rapide. La durée est bornée entre 150 ms et 20 s, pour qu'une valeur
extrême ne fige pas les points ni ne les rende illisibles.

Les tracés sont calculés **en pixels**, à partir des positions réellement mesurées des tuiles et de l'anneau : ils
touchent le bord du cercle au lieu de s'arrêter sur son carré englobant, et se retracent au redimensionnement, jamais
à chaque changement d'état. Les points suivent exactement le même chemin que le trait, via `offset-path`.

L'éditeur graphique couvre le centre et l'apparence ; `sources` et `consumers` étant des listes d'objets, elles se
remplissent en YAML — `ha-form` ne sait pas éditer ce genre de structure.

---

## Nothing Clock Card

Elle n'observe aucune entité : l'heure vient de l'appareil qui affiche le tableau de bord.

```yaml
type: custom:nothing-clock-card
layout: digital
size: lg
```

| Option                       | Défaut               | Description                                                  |
|------------------------------|----------------------|--------------------------------------------------------------|
| `layout`                     | `digital`            | `digital`, `stack`, `ring`, `progress` ou `week`.            |
| `size`                       | `md`                 | `sm`, `md`, `lg` — hauteur des chiffres.                     |
| `variant`                    | `dark`               | Fond anthracite ou blanc cassé.                              |
| `dots` / `date_dots`         | `true` / `false`     | Matrice de points sur les chiffres, et sur la ligne de date. |
| `date` / `weekday`           | `true` / `true`      | La ligne de date, et le jour de la semaine dedans.           |
| `seconds`                    | `false`              | Afficher les secondes.                                       |
| `hour12`                     | selon la langue      | Forcer 12 h ou 24 h.                                         |
| `periods`                    | jour, semaine, mois, année | Les jauges de la disposition `progress`.               |
| `week_start`                 | `monday`             | `monday` ou `sunday`, pour la jauge de semaine.              |
| `cells`                      | `20`                 | Points par jauge de période.                                 |
| `days`                       | `5`                  | Jours de la bande `week`.                                    |
| `accent`                     | `#E01F26`            | Repère de minutes, jour courant, point de tête des jauges.   |
| `tap_action` / `hold_action` | `none`               | Sans action, la carte ne reçoit aucun écouteur.              |

**Les cinq dispositions.** `digital` écrit l'heure sur une ligne avec la date au-dessus. `stack` empile les heures
sur les minutes. `ring` dessine un cadran de soixante points, avec l'aiguille des minutes en rouge et celle des heures
en blanc sur l'anneau intérieur. `progress` montre où en est le jour, la semaine, le mois et l'année, chaque jauge
terminée par un point rouge — c'est là qu'on en est. `week` déroule une bande de jours, aujourd'hui en rouge sous son
repère.

**Le rafraîchissement se cale sur le prochain changement d'unité** — seconde ou minute — au lieu d'attendre un
intervalle fixe : l'affichage bascule pile au bon moment, et une horloge sans secondes ne se réveille pas cinquante-neuf
fois pour rien.

Les noms de jours et de mois suivent la langue de Home Assistant, et le format 12 h ou 24 h s'en déduit sauf réglage
contraire. Le numéro de semaine est celui d'ISO 8601 ; seul le jour de départ de la **jauge** suit `week_start`, parce
qu'il change d'un pays à l'autre.

---

## Nothing Thermostat Card

```yaml
type: custom:nothing-thermostat-card
entity: climate.pompe_a_chaleur
variant: light
```

| Option                                            | Défaut       | Description                                             |
|---------------------------------------------------|--------------|---------------------------------------------------------|
| `entity`                                          | —            | **Requis.** Entité `climate.*`.                         |
| `name`                                            | nom convivial| Libellé de l'en-tête.                                   |
| `variant`                                         | `dark`       | Fond anthracite ou blanc cassé.                         |
| `min` / `max` / `step`                            | ceux de l'appareil | Bornes et pas de la consigne.                     |
| `ticks`                                           | `64`         | Traits de la graduation.                                |
| `unit`                                            | `°`          | Unité à côté de la consigne.                            |
| `decimals`                                        | automatique  | Arrondi de la consigne.                                 |
| `dots`                                            | `true`       | Chiffres et libellés en matrice de points.              |
| `show_name` / `show_state` / `show_current` / `show_mode` | `true` | Masquer l'un ou l'autre.                          |
| `accent`                                          | `#E01F26`    | Graduation et repère quand l'appareil chauffe.          |

**Le cadran se règle au doigt.** Un arc de 270 degrés, ouvert en bas : l'angle du doigt autour du centre donne la
consigne, ramenée au pas de l'appareil. Hors de l'arc — dans l'ouverture — la valeur reste à l'extrémité la plus
proche, de sorte qu'un glissement sous le cadran ne fait pas sauter la consigne d'un bout à l'autre.

La graduation **monte en intensité** jusqu'au repère puis s'efface : l'œil suit la course du réglage sans qu'il faille
une couleur de plus. Elle passe à l'accent quand `hvac_action` vaut `heating`, au bleu quand elle vaut `cooling`.

**La pilule du bas** porte l'alimentation à gauche — elle éteint, ou rallume sur le premier mode utile déclaré par
l'appareil — et le mode courant. Un appui dessus fait défiler les modes de `hvac_modes` ; un appui long ouvre la fiche
de l'entité.

Le rendu est optimiste et les appels de service sont limités à un toutes les 200 ms, avec envoi final au relâchement.
Les consignes doubles (`target_temp_low` / `high`) affichent la borne basse : un cadran n'a qu'un repère.

---

## Nothing Weather Card

```yaml
type: custom:nothing-weather-card
entity: weather.maison
layout: full
variant: light
```

| Option                       | Défaut          | Description                                                  |
|------------------------------|-----------------|--------------------------------------------------------------|
| `entity`                     | —               | **Requis.** Entité `weather.*`.                              |
| `name`                       | nom convivial   | Le lieu, sous la température.                                |
| `layout`                     | `full`          | `full`, `compact`, `hourly`, `daily` ou `tile`.              |
| `variant`                    | `dark`          | Fond anthracite ou blanc cassé.                              |
| `hours` / `days`             | `6` / `3`       | Colonnes horaires et lignes quotidiennes.                    |
| `dots` / `decimals` / `unit` | `true` / auto / `°` | Matrice de points, arrondi, symbole.                     |
| `show_current`, `show_condition`, `show_range`, `show_name`, `show_hourly`, `show_daily` | selon la disposition | Forcer l'affichage d'une section, ou l'enlever. |

**Les cinq dispositions.** `full` reprend l'écran complet : grand pictogramme, condition, température, bande horaire et
lignes quotidiennes. `compact` s'en tient à l'instant. `hourly` et `daily` n'affichent qu'une bande. `tile` tient dans
un carré : pictogramme, température, extrêmes.

Les sections suivent la disposition, mais chaque `show_*` la contredit : `layout: hourly` avec `show_current: true`
remet l'instant au-dessus de la bande.

**Les barres quotidiennes partagent une seule échelle.** Une journée de 9 à 20 degrés occupe plus de largeur qu'une de
12 à 17, et la position de chaque barre situe la journée dans l'amplitude de la semaine — c'est ce qui permet de les
comparer d'un coup d'œil, ce qu'une barre remise à zéro sur chaque ligne ne permettrait pas.

**Les prévisions passent par un abonnement.** Depuis Home Assistant 2023.9, `attributes.forecast` a disparu au profit
de `weather/subscribe_forecast`. La carte s'y abonne pour les prévisions horaires et quotidiennes, et retombe sur
l'ancien tableau d'attributs pour les intégrations qui le publient encore — l'écart entre deux entrées suffit à savoir
s'il s'agit d'heures ou de jours. Une intégration qui ne fournit pas un type laisse simplement la section masquée.

Les pictogrammes couvrent les conditions de Home Assistant, alias compris (`lightning-rainy`, `snowy-rainy`,
`windy-variant`), et retombent sur un point d'exclamation pour l'inconnu.

---

## Notes

- **Dimensionnement** — chaque carte expose `getGridOptions()` pour la vue *sections* et ne déborde jamais de sa tuile,
  quelle que soit la taille demandée.
- **Éditeur graphique** — les treize cartes fournissent `getConfigForm()` : elles se configurent à la souris, sans passer
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
