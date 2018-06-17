import { h, Component } from 'preact'
import { Router, route } from 'preact-router'

import HomePage from 'pages/home'

// import SignInPage from 'pages/sign/in'
// import SignUpPage from 'pages/sign/up'
// import SignForgotPage from 'pages/sign/forgot'
// import CompanyPage from 'pages/company'
// import PrevisionPage from 'pages/prevision'
// import BeginPage from 'pages/begin'
// import CgvPage from 'pages/about/cgv'
// import Routes, {paths} from 'services/routes'

// const onChange = obj => window.ga && ga.send('pageview', { dp:obj.url });

export interface AppProps {}
interface AppState {}
export default class App extends Component<AppProps, AppState> {
  render(props: AppProps, state: AppState) {
    return (
      <Router>
        <HomePage path="/" />
        {/* <HomePage path={paths.homePath} />
        <HomePage path={paths.logoPath} />
        <SignInPage path={paths.signInPath} />
        <SignUpPage path={paths.signUpPath} />
        <SignForgotPage path={paths.signForgotPath} />
        <BeginPage path={paths.beginPath} />
        <CompanyPage path={paths.companyPath} />
        <PrevisionPage path={paths.previsionPath} />
        <CgvPage path={paths.cgvPath} /> */}
      </Router>
    )
  }
}