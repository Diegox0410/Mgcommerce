import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseEnvironment } from './config'

export interface FirebaseClient {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let client: FirebaseClient | null = null

export function getFirebaseClient(): FirebaseClient {
  if (client) return client
  const config = firebaseEnvironment()
  if (!config) throw new Error('Firebase no está configurado para MG.')
  const app = getApps().length ? getApp() : initializeApp(config)
  client = { app, auth: getAuth(app), db: getFirestore(app) }
  return client
}
