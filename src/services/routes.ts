import { route } from 'preact-router';

export const paths = {
  homePath: '/',
  logoPath: '/logo',
  signInPath: '/sign-in',
  signUpPath: '/sign-up',
  signForgotPath: '/sign-forgot',
  beginPath: '/begin',
  companyPath: '/company/:companyId/',
  previsionPath: '/company/:companyId/prevision',
  cgvPath: '/cgv',
}

export default class Routes {

  static route(path: string, replaces?: { [name: string]: string }) {
    console.log('route', path, replaces)
    if (replaces) {
      for (const name of Object.keys(replaces)) {
        const key = ':' + name
        const value = replaces[name]
        console.log('key', key)
        console.log('value', value)
        path = path.replace(key, value)
        console.log('path', path)
      }
    }
    route(path)
  }
  
  static home() { this.route(paths.homePath) }
  static logo() { this.route(paths.logoPath) }
  static signIn() { this.route(paths.signInPath) }
  static signUp() { this.route(paths.signUpPath) }
  static signForgot() { this.route(paths.signForgotPath) }
  static begin() { this.route(paths.beginPath) }
  static company(companyId: string) { this.route(paths.companyPath, { companyId }) }
  static prevision(companyId: string) { this.route(paths.previsionPath, { companyId }) }
  static cgv() { this.route(paths.cgvPath) }

}