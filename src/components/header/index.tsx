import { h, Component } from 'preact'
import Icon from 'components/icon'
import Button from 'components/button'
import { subscriptions } from 'services/helper'
import { auth$ } from 'services/api'
import { importAuth } from 'services/fire'
import { route } from 'preact-router'
import MdHome from 'preact-icons/lib/md/home'
import MdPlayArrow from 'preact-icons/lib/md/play-arrow'
import MdExitToApp from 'preact-icons/lib/md/exit-to-app'
import MdPersonAdd from 'preact-icons/lib/md/person-add'
import MdPerson from 'preact-icons/lib/md/person'
import MdSearch from 'preact-icons/lib/md/search'
import './style.css'
import Routes from 'services/routes';

interface Props { class?, className?, children?, handleHelpClick: (e: any) => void }
interface State { isAuthenticated:boolean }
export default class Header extends Component<Props, State> {

  componentDidMount() {
    subscriptions(this).add(
      auth$.subscribe(({ isAuthenticated }) => {
        this.setState({ isAuthenticated })
      })
    )
  }

  componentWillUnmount() {
    subscriptions(this).unsubscribe()
  }

  onSignOut = async () => {
    const auth = await importAuth()
    await auth.signOut()
    Routes.signIn()
  }
  
  render({handleHelpClick}: Props, {isAuthenticated}: State) {
    return (
      <div class="header">
        <Button class="header_logo" href="/logo">Illico 0.3</Button>
        <Button class="header_btn" href="/"><MdHome /> Accueil</Button>
        <Button class="header_btn" href="/begin"><MdPlayArrow /> Commencer</Button>
        <div class="header_flex" />
        {isAuthenticated ?
          <Button class="header_btn" onClick={this.onSignOut}><MdExitToApp /> Déconnexion</Button>
        :[
          <Button class="header_btn" href="/sign-up"><MdPersonAdd /> S'inscrire</Button>,
          <Button class="header_btn" href="/sign-in"><MdPerson /> Connexion</Button>
        ]}
        <Button class="header_help" onClick={handleHelpClick}><MdSearch /> Besoin d'aide ?</Button>
      </div>
    );
  }
}