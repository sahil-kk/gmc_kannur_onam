const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Cloud functions are no longer needed for manual GPay verification.
// We keep this file to avoid breaking the functions deployment.
