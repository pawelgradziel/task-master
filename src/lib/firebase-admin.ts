import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK based on environment
if (!admin.apps.length) {
  // Check if we're in a Firebase/Google Cloud environment
  const isFirebaseEnvironment = process.env.FIREBASE_CONFIG || 
                                process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                                process.env.GCLOUD_PROJECT ||
                                process.env.K_SERVICE; // Cloud Run/App Hosting indicator

  if (isFirebaseEnvironment) {
    console.log('🔥 Initializing Firebase Admin with Application Default Credentials (Firebase App Hosting/Cloud environment)');
    // Use Application Default Credentials in Firebase/Google Cloud environments
    admin.initializeApp();
  } else {
    // Try to load service account config for local development
    let serviceAccountConfig = null;
    const serviceAccountPath = path.join(__dirname, '../../private/service-account.json');

    try {
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccountConfig = require('../../private/service-account.json');
        console.log('🔑 Initializing Firebase Admin with service account credentials (local development)');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountConfig)
        });
      } else {
        console.log('⚠️  Service account JSON not found, falling back to Application Default Credentials');
        admin.initializeApp();
      }
    } catch (error) {
      console.log('⚠️  Error loading service account, using Application Default Credentials:', error instanceof Error ? error.message : String(error));
      admin.initializeApp();
    }
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth }
