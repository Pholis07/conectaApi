import { getApp, getApps, initializeApp } from "firebase/app";

// La config sale de .env.local (ver .env.example). Las variables EXPO_PUBLIC_ van dentro del bundle,
// así que no guardes aquí secretos de servidor: la seguridad real son las reglas de Firebase.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// getApps evita inicializar dos veces con el recargado en caliente.
export const app = getApps().length ? getApp() : initializeApp(config);
