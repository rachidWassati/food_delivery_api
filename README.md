# API Food Delivery

[![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/votre_utilisateur/votre_projet/releases/tag/v1.0.0)
[![Node.js Version](https://img.shields.io/badge/node.js-%3E%3D%2021.2.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript Version](https://img.shields.io/badge/typescript-%5E5.3.2-blue.svg)](https://www.typescriptlang.org/)

Implémentation d'une API pour frontend, qui gère les restaurants et les utilisateurs pour une application de livraison de nourritue style UberEats

## Installation

Assurez-vous d'avoir Node.js installé. Clonez ce dépôt, puis installez les dépendances en utilisant la commande suivante (le dossier `dist` sera généré à l'issue de la commande):

```bash
npm install
```

Déploiement avec Heroku, créer les `Configs Vars` suivant:
```
heroku config:set MONGO_URI="mongodb+srv://<username>:<password>@<cluster_name>.pr4ht.mongodb.net/?retryWrites=true&w=majority"
heroku config:set APP_SECRET=*****************
heroku config:set ACCOUNT_SID=****************
heroku config:set AUTH_TOKEN=***************
heroku config:set PHONE_NUMBER=+************
```

## Endpoints

## Administrateur routes
### 1. `POST /api/v1/admin/restaurant`
Ajouter un nouveau restaurant.

Exemple de body
```
{
    "name": "La Brasserie Parisienne",
    "ownerName": "Pierre Martin",
    "foodTypes": ["French", "Brasserie"],
    "postalcode": "75002",
    "address": "30 Rue Montorgueil",
    "phone": "01 55 66 77 88",
    "email": "brasserieparisienne@gmail.com",
    "password": "qwerty"
}
```

### 2. `GET /api/v1/admin/restaurant`
Récupère la liste de tous les restaurants.

### 3. `GET /api/v1/admin/restaurant/:id`
Récupère les détails d'un restaurant spécifique.

## Restaurant routes
### 1. `POST /api/v1/restaurant/login`
Permet à un restaurant de se connecter

Exemple de body:
```
{
    "email":"brasserieparisienne@gmail.com",
    "password": "qwerty"
}
```

### 2. `GET /api/v1/restaurant/profile`
Récupère les détails du restaurant connecté

### 3. `PATCH /api/v1/restaurant/profile`
Permet au restaurant connecté de mettre à jour son profile

Exemple de body:
```
{
    "name": "La Brasserie Parisienne",
    "foodTypes": ["French", "Brasserie"],
    "address": "30 Rue Montorgueil",
    "phone": "01 55 66 99 88"
}
```

### 4. `PATCH /api/v1/restaurant/service`
Permet au restaurant de mettre à jour son statut de disponibilité

### 5. `POST /api/v1/restaurant/food`
Permet au restaurant d'ajouter un nouveau plat a sa carte de livraison
```
form-data

|key            | value                                     |
|-------------- | ------------------------------------------|
|name           | Steack Hache                              |
|description    | Un steack hache avec de la sauce poivre   |
|categorie      | viande                                    |
|foodType       | NoVeg                                     |
|pric           | 35                                        |
|readyTim       | 20                                        |
|images         | filestype                                 |

```

### 6. `GET /api/v1/restaurant/foods`
Récupère la liste des plats proposés par le restaurant à la livraison

## Shopping routes
### 1 `GET /api/v1/:postalcode`
Récupère la liste des plats disponible à la livraison sur le code postal défini

### 2 `GET /api/v1/top-restaurants/:postalcode/:limit`
Récupère les n tops restaurants dans le code postal défini

### 3 `GET /api/v1/foods-in-30-min/:postalcode`
Récupère les plats livrés en moins de 30 minutes dans le code postal défini

### 4 `GET /api/v1/search/:postalcode`
Fait une recherche des plats disponible dans le code postal défini

### 5 `GET /api/v1/show/:restaurant_id`
Affiche les informations propre à un restaurant en particulier

## Customer routes
### 1 `GET /api/v1/customer/signup`
Créer un nouveau compte utilisateur

Exemple de body:
```
{
    "email" : "rachid.jeffali@gmail.com",
    "password": "qwerty",
    "phone": "07XXXXXXXX"
}
```
A l'issue de l'inscription, un OTP est envoyé sur le mobile du nouvel utilisateur

### 2 `PATCH /api/v1/customer/verify`
Vérifie le nouvel utilisateur inscrit

Exemple de body:
```
{
    "otp" : "591474"
}
```

### 3 `POST /api/v1/customer/login`
Connecte l'utilisateur à son espace

Exemple de body
```
{
    "email": "rachid.jeffali@gmail.com",
    "password": "qwerty"
}
```

### 4 `GET /api/v1/customer/otp`
Fait une demande d'OTP

### 5 `GET /api/v1/customer/profile`
Affiche le profil utilisateur

### 6 `PATCH /api/v1/customer/signup`
Met a jour le profil utilisateur

Exemple de body:
```
{
    "firstname": "Rachid",
    "lastname": "Jeffali",
    "address": "25 rue de la paix"
}
```

## Order routes
### 1 `POST /api/v1/customer/create-order`
Creer une commande

Exemple de body:
```
[
    { "_id": "657b1efbd187464e0367f597", "unit": 2},
    { "_id": "657b8ac481658943a5d6aecd", "unit": 1}
]
```


## Tâches

* [X] Mise en place de la structure de base du projet
* [X] Configuration de l'environnement de développement
* [X] Mise en place du serveur Node.js avec Express
* [X] Configuration de TypeScript
* [X] Connexion à la base de données
* [X] Implémentation des endpoints de base
* [ ] Ajout de la gestion des erreurs
* [X] Documentation des endpoints dans le README
* [ ] Ajout de fonctionnalités spécifiques à la livraison de nourriture
* [ ] Tests unitaires
* [ ] Tests d'intégration
* [X] Mise en production
* [ ] Documentation complète