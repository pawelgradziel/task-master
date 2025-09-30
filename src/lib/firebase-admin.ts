import admin from 'firebase-admin';

let credential;

try {
  // Try to load service account from file
  const serviceAccountConfig = require('../../private/service-account.json');
  credential = admin.credential.cert(serviceAccountConfig);
} catch (error) {
  // If service account file doesn't exist, try to use default credentials
  // This works in environments like Google Cloud Run, App Engine, etc.
  console.log('Service account file not found, using default credentials');
  credential = admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential
  })
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth }
