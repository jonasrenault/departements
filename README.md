<div align="center">
  <img alt="Quiz Départements logo" src="public/logo_with_title.png" style="width:50%;">
</div>

<p align="center">
<a href="LICENSE" rel="nofollow"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" style="max-width:100%;"></a>
</p>

<p align="center">
    <a href="https://jrenault.fr/departements"><b>Site Web</b></a>
</p>


# Quiz Départements

**Quiz Départements** est une application open-source de quiz sur les départements français. Elle propose différents modes de jeu (pointer le département, nommer le département) ainsi que des options pour personnaliser l'affichage.

## Développement

Cette application est constuite avec [React](https://reactjs.org/) et [Vite](https://vitejs.dev/).

## Prérequis

- [Node.js](https://nodejs.org/en/) doit être installé sur la machine, ainsi que `npm` pour la gestion des dépendences.

## Installation

Pour installer les dépendences du projet, exécuter

```console
npm install
```

## Démarrer un serveur de développement

Pour démarrer un serveur de développement, exécuter

```console
npm run dev
```

L'application sera alors disponible à l'adresse `http://localhost:5173/departements`. Ouvrez un navigateur à cette adresse pour accéder à l'application.

## Compiler l'application

Pour compiler l'application en production, exécuter

```console
npm run build
```

Les fichiers sources de l'application seront compilés et disponibles dans le répertoire `dist`, qui peut ensuite être déployé par un serveur static.

## Linting

Pour linter le code de l'application, exécuter

```console
npm run lint
```

