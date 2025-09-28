import admin from 'firebase-admin';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const serviceAccountConfig = require('../../private/service-account.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig)
  })
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth }
