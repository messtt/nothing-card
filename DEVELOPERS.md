# Développement

Ce dépôt suit l'organisation d'un dépôt de cartes Lovelace moderne : des sources
découpées en modules dans `src/`, un bundle unique livré dans `dist/`, et un banc
d'essai qui charge ce bundle sans Home Assistant.

## Démarrer

```bash
npm install
npm run build      # construit dist/nothing-card.js
npm run watch      # reconstruit à chaque enregistrement
npm run preview    # http://localhost:8137/preview/
```

Le banc d'essai (`preview/`) monte les trois cartes avec un faux objet `hass` :
états, `callService`, `callWS`. C'est le moyen le plus rapide de voir une
modification sans redémarrer Home Assistant.

## Carte de l'arborescence

```
src/
├── nothing-card.js          point d'entrée : importe les cartes, rien d'autre
│
├── var/
│   ├── version.js           VERSION (source de vérité) et URL du dépôt
│   └── consts.js            palette, pile typographique, états « allumé », icônes
│
├── tools/                   code partagé, sans état, testable isolément
│   ├── dot-matrix.js        police 5x7 + rendu SVG des textes
│   ├── color.js             TSV -> RVB, Kelvin -> RVB, analyse de couleurs CSS
│   ├── entity.js            état, nom, icône, bascule adaptée au domaine
│   ├── tap-actions.js       actions Lovelace, appui court/long, glisser
│   ├── history.js           recorder : statistiques, historique, agrégation
│   ├── styles.js            adoption des feuilles de style (CSSStyleSheet)
│   ├── register.js          customElements + window.customCards
│   └── utils.js             fireEvent, throttle, ResizeObserver, formatage
│
├── components/
│   └── base-card/           classe de base : config, shadow root, cycle de vie
│
└── cards/
    ├── button/
    ├── light/
    └── stats/
        ├── index.js         la classe : config par défaut, taille, cycle de vie
        ├── create.js        gabarit HTML, références DOM, branchement des gestes
        ├── changes.js       tout ce qui se remet à jour quand l'état change
        ├── editor.js        schéma `ha-form` + configuration d'exemple
        ├── helpers.js       calculs propres à la carte
        └── styles.js        la feuille de style, en chaîne
```

La règle : **`create.js` construit une fois, `changes.js` met à jour souvent.**
Tout ce qui sert à plus d'une carte remonte dans `tools/`.

## Ajouter une carte

1. `src/cards/ma-carte/` avec les six fichiers ci-dessus.
2. La classe étend `NothingBaseCard` et déclare `static cardType`, `static styles`,
   `static defaults`, `static accentVar`.
3. Elle implémente `template()`, `collect()`, `bind()`, `render()` — et
   `reset()` si elle garde un état interne à effacer au changement de config.
4. Elle appelle `registerCard({ ... })` en bas du fichier.
5. Une ligne `import "./cards/ma-carte/index.js";` dans `src/nothing-card.js`.

Rien d'autre : le bundle, l'entrée du sélecteur de cartes et la bannière console
suivent tout seuls.

## Ce que la classe de base prend en charge

`NothingBaseCard.setConfig()` fait, dans l'ordre :

1. `validateConfig(config)` — lève une erreur lisible si la config est inutilisable ;
2. fusion avec `static defaults`, puis `normalizeConfig()` pour borner les valeurs ;
3. création du shadow root et **adoption** de la feuille de style — construite une
   seule fois par type de carte et partagée par toutes les instances ;
4. remise à zéro des mémos de rendu (`this.memo`) et de l'état interne (`reset()`) ;
5. report des couleurs de config dans les variables CSS de l'hôte (`applyColors()`) ;
6. `template()` → `collect()` → `bind()` → `render()`.

Le setter `hass` n'appelle que `render()`. Les cartes gardent leurs comparaisons
(`this.memo.name !== name`) pour ne repeindre que ce qui a bougé : un SVG de
matrice de points coûte cher à regénérer à chaque tick d'état.

## Version et publication

`src/var/version.js` porte la version. `npm version patch|minor|major` la
recopie depuis `package.json`, reconstruit `dist/` et met le tout dans le commit.

`dist/nothing-card.js` est **versionné dans git** : HACS et les installations
manuelles récupèrent le fichier tel quel, sans étape de construction. La CI
vérifie qu'il correspond bien aux sources (`git diff --exit-code -- dist/`).
