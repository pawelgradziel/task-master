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

```bash
yarn
yarn dev
```

App is available at http://localhost:9002/

## Firestore demo

### `main` branch

* very basic TO-DO app
* shows that enabling Google Auth is needed
* shows that we need to update Firestore Rules to allow reading from `tasks` collection

```text
    match /tasks/{id} {
      allow read, write: if true;
    }
```

Data filtering by user (see `use-tasks.ts`)

```ts
   const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
```

### `demo-part-2-google-auth` branch

Code from `main` plus App allows to log in with Google Auth

### `demo-part-3-collection-group` branch

Code from `demo-part-2-google-auth` plus App is using safer approach to store/read data by using subcollection

```ts
   const q = query(
      collection(db, 'user', user.id, 'tasks'),
      orderBy('createdAt', 'desc')
    );
```

Updated Firestore rule

```text
    match /users/{userId}/tasks/{taskId} {
      // Only allow access if user is authenticated and accessing their own tasks
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
```

### `demo-part-4-cloud-functions` branch

Code from `demo-part-3-collection-group` plus App is using cloud function to get tasks and uses collection group to read data from database.

We could also read from collection group from frontend, and that requires new Firestore rule:

```text
    match /{path=**}/tasks/{taskId} {
      // Only allow access if user is authenticated and accessing their own tasks
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
```
