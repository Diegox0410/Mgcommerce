export interface FirebaseEnvironment {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export const firebaseEnvironment = (): FirebaseEnvironment | null => {
  const env = import.meta.env
  const apiKey = env.VITE_FIREBASE_API_KEY?.trim()
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN?.trim()
  const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim()
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET?.trim()
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim()
  const appId = env.VITE_FIREBASE_APP_ID?.trim()
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) return null
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  }
}

export const isFirebaseConfigured = (): boolean => firebaseEnvironment() !== null
