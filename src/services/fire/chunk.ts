import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import { firebaseConfig } from 'common/config'

export const app = !firebase.apps.length ?
  firebase.initializeApp(firebaseConfig) :
  firebase.app()

export const auth = app.auth()
export const store = app.firestore()

// Promise.resolve(null)
// .then(() => store.enablePersistence())
// .then(() => console.log('firestore persistence enabled'))
// .catch(err => {
//   switch (err.code) {

//     // This platform is either missing IndexedDB or is known to have an incomplete implementation.
//     case 'unimplemented':
//       break

//     // If Firestore has already been started and persistence isn't an error
//     case 'failed-precondition':
//       break

//     default:
//       console.log('enablePersistence', err.code)
//       console.error('enablePersistence', err.code, err)
//       break
//   }
// })