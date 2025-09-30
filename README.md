# Firebase Showcase - TODO app

This is sample app to show Firebase ecosystem

* Firestore as NoSQL database
* React integration to read data from database
* use Google Authentication
* use cloud function with local environment

## Setup

### .env

* copy `.env.example` into `.env`
* keys needed can be found in Firebase's project settings, tab "General"

### private/service-account.json

* go to Firebase's project settings
* switch to Service Accounts
* select "Node JS"
* click "Generate new private key"
* save file in folder `private/service-account.json`

## Start

```
yarn
yarn dev
```

App is available at http://localhost:9002/
