import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getFirebaseClient } from '../firebase/client'

export const observeAuth = (listener: (user: User | null) => void): (() => void) =>
  onAuthStateChanged(getFirebaseClient().auth, listener)

export const signInOwner = async (email: string, password: string): Promise<User> => {
  const credential = await signInWithEmailAndPassword(getFirebaseClient().auth, email, password)
  return credential.user
}

export const signOutOwner = async (): Promise<void> => signOut(getFirebaseClient().auth)
