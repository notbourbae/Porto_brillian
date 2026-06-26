import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase using the provisioned credentials
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Validation check to verify connection to Firestore as required by SKILL.md
async function testConnection() {
  try {
    // Attempt to read a test document to verify Firestore connection is active
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
