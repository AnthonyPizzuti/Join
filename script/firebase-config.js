/**
 * Firebase-Konfigurationsdetails.
 * 
 * Diese Konstante enthält die notwendigen Informationen zur Initialisierung der Verbindung
 * mit Firebase. Die Werte müssen mit den Projektdetails aus der Firebase-Konsole übereinstimmen.
 * 
 * @constant {Object} FIREBASE_CONFIG
 * @property {string} apiKey - Der API-Schlüssel des Firebase-Projekts, der für die Authentifizierung verwendet wird.
 * @property {string} authDomain - Die Authentifizierungs-Domain des Firebase-Projekts.
 * @property {string} databaseURL - Die URL der Firebase-Realtime-Datenbank.
 * @property {string} projectId - Die Projekt-ID des Firebase-Projekts.
 * @property {string} storageBucket - Der Storage-Bucket für Dateien in Firebase.
 * @property {string} messagingSenderId - Die Sender-ID für Firebase Cloud Messaging.
 * @property {string} appId - Die App-ID des Firebase-Projekts.
 */
// Firebase-Konfiguration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCk8MTg2sBksRYFUR4mjmL3nwv9Fd0POWQ",
  authDomain: "join-1048f.firebaseapp.com",
  databaseURL: "https://join-1048f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-1048f",
  storageBucket: "join-1048f.firebasestorage.app",
  messagingSenderId: "430867630016",
  appId: "1:430867630016:web:f559df3528fc182d2b2a25"
};

// Firebase initialisieren
const APP = firebase.initializeApp(FIREBASE_CONFIG);
const DATABASE = firebase.database(APP);


