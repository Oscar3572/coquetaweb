// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔐 Configuración usando variables del entorno (.env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🧠 Si ya hay una app inicializada, reutilízala (importante para desarrollo con Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔥 Instancias de Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// 📤 Exportamos para usar en toda la app
export { app, db, auth };
