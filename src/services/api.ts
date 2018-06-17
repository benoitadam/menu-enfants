import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/toPromise'
import User from 'models/User'
import Company from 'models/Company'
import { toArray, storage } from 'services/helper'
import { importAuth } from 'services/fire'
import importDb from 'models/db'
import { apiUrl } from 'common/config'
import moment from 'moment'

importAuth().then(auth => {

  console.log('importAuth')
  auth$.subscribe(auth => storage('auth', auth.toObject()))
  if (typeof window !== "undefined") (window as any)._auth$ = auth$

  let userUnsubscribe = () => {}
  
  auth.onAuthStateChanged(fireUser => {
    console.log('onAuthStateChanged', fireUser)
    auth$.next(new AuthState({ fireUser }))
    if (fireUser) {
      const userId = fireUser.uid
      const email = fireUser.email
      
      importDb().then(db => {
        // User data change
        userUnsubscribe()
        userUnsubscribe = db.users.onItem(userId, user => {
          if (!user) {
            // Create user if not exist
            console.log('add current user in db', userId, email)
            db.users.set({ _id: userId, email })
            return // wait next snapshot
          }
          // Push new auth data
          auth$.next(new AuthState({ fireUser, user }))
        })
      })
    }
  })
})

export class AuthState {
  id: string = null
  email: string = null
  isAuthenticated: boolean = false
  fireUser: any = null
  user: User = null

  constructor(data?: { id?: string, email?: string, isAuthenticated?: boolean, fireUser?: any, user?: User }) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.email) this.email = data.email
      if (data.isAuthenticated) this.isAuthenticated = data.isAuthenticated
      if (data.user) this.user = data.user
      if (data.fireUser) {
        this.fireUser = data.fireUser
        this.id = data.fireUser.uid
        this.email = data.fireUser.email
        this.isAuthenticated = true
      }
    }
  }
  
  toObject() {
    const { id, email, isAuthenticated, user } = this
    return { id, email, isAuthenticated, user }
  }
}

export const auth$ = new BehaviorSubject<AuthState>(new AuthState(storage('auth')))

const api = {
  previsionReport: (companyId: string) => {
    const pdfLink = `${apiUrl}/previsionReport/${companyId}-${moment().format('YYYYMMDDhhmmss')}.pdf`
    window.open(pdfLink, '_blank', 'fullscreen=yes')
  }
}
export default api