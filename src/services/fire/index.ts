import { FirebaseAuth } from '@firebase/auth-types';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { FirebaseApp } from '@firebase/app-types';

interface Fire { store: FirebaseFirestore, auth: FirebaseAuth, app: FirebaseApp }

export function importFire(): Promise<Fire> {
  return import(/* webpackChunkName:"fire" */'services/fire/chunk')
}

export function importAuth(): Promise<FirebaseAuth> {
  return importFire().then(({ auth }) => auth)
}

export function importStore(): Promise<FirebaseFirestore> {
  return importFire().then(({ store }) => store)
}

export function importApp(): Promise<FirebaseApp> {
  return importFire().then(({ app }) => app)
}