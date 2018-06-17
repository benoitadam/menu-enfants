import { h, Component } from 'preact'
import { cls } from 'services/helper'
import Form from 'components/form'
import Field from 'components/field'
import Icon from 'components/icon'
import { importAuth } from 'services/fire'
import importDb from 'models/db'
import { route } from 'preact-router'
import Modal from 'components/modal'
import Button from 'components/button'
import Link from 'components/link'
import './style.css'
import Routes from 'services/routes';

interface Props { isUp?: boolean, isForgot?: boolean }
interface State { errors?: { [name:string]:string } }
export default class Sign extends Component<Props, State> {
  onValidate = async (values: any) => {
    console.log('onValidate', values)

    const { isUp, isForgot } = this.props
    const { email, password, optin, optinPartner } = values

    const auth = await importAuth()
    const db = await importDb()

    try {

      if (isUp) {

        // Création du compte de l'utilisateur
        const user = await auth.createUserWithEmailAndPassword(email, password)

        await Promise.all([
          // Enregistrement du compte dans la base de données
          db.users.set({ _id: user.uid, email, optin, optinPartner }),
          // Envoie du mail de vérification
          user.sendEmailVerification()
        ])

        await Modal.success({
          title: 'Valider votre compte',
          content: 'Cherchez l’e-mail de validation dans votre boîte de réception et cliquez sur le lien qu’il contient. Un message de confirmation s’affiche dans votre navigateur.',
          buttons: ['Revenir à l’écran de connexion']
        })

        Routes.signIn()

      }
      else if (isForgot) {

        const info = await auth.sendPasswordResetEmail(email)

        console.log('Forgot success', info, this.props)

        await Modal.success({
          title: 'Réinitialisez votre mot de passe',
          content: 'Un e-mail contenant un lien vous permettant de renseigner votre nouveau mot de passe vient de vous être envoyé. Vérifiez qu’il ne se trouve pas dans votre dossier de courriers indésirables.',
          buttons: ['Revenir à l’écran de connexion']
        })

        Routes.signIn()

      }
      else {

        const user = await auth.signInWithEmailAndPassword(email, password)

        console.log('SignIn success', user, this.props);

        if (!user.emailVerified) {
          console.log('Send Email Verification');
          await auth.signOut()
          await Modal.success({
            title: 'Valider votre compte',
            content: 'Cherchez l’e-mail de validation dans votre boîte de réception et cliquez sur le lien qu’il contient. Un message de confirmation s’affiche dans votre navigateur.',
            buttons: ['Ok']
          })
          return
        }
        
        Routes.begin()

      }
      
    } catch(error) {
      
      switch (error.code) {
        case 'auth/invalid-email': throw { 'email': 'Cette adresse email n’est pas valide !' }
        case 'auth/user-not-found': throw { 'email': 'Cette adresse email n’est pas enregistrée dans notre base de données !' }
        case 'auth/email-already-in-use': throw { 'email': 'Cette addresse email existe déjà dans notre base de données !' }
        case 'auth/wrong-password': throw { 'password': 'Ce n’est pas le bon mot de passe !' }
        case 'auth/weak-password': throw { 'password': 'Le mot de passe doit contenir au moins 6 caractères !' }
        case 'auth/network-request-failed': throw 'Vous ne semblez plus être connecté à internet ?'
        default: throw error
      }

    }
  }
  
  render({ isUp, isForgot, ...rest }: Props, { errors }: State) {
    const isIn = !isUp && !isForgot
    return (
      <div class={cls(rest, 'sign', isUp?'sign-up' : isForgot?'sign-forgot' : 'sign-in')}>
        <div class="sign-bg" />
        <div class="sign-panel">
          {isIn && <div class="sign-title">Connectez-vous</div>}
          {isUp && <div class="sign-title">Inscrivez-vous</div>}
          {isForgot && <div class="sign-title">Récupérer votre compte</div>}

          <Form onValidate={this.onValidate} errors={errors} noButtons>

            <Field required inline type="email" name="email" label="E-Mail" autoComplete="email" prefix={<Icon type="user" />} placeholder="hello@mail.com" />
            {isForgot ? undefined :
              <Field required inline type="password" name="password" label="Mot de passe" autoComplete="email" placeholder="******" />
            }

            {isIn && [
              <Link href="/sign-forgot">mot de passe oublié ?</Link>,
              <Form.Button>Je me connecte</Form.Button>,
              <Link href="/sign-up">Vous n'êtes pas inscrit sur Illico ? <b>Inscrivez-vous</b></Link>
            ]}

            {isUp && [
              <Field inline type="checkbox" name="optin">Oui, je souhaite recevoir les informations de Illico</Field>,
              <Field inline type="checkbox" name="optinPartner">Oui, je souhaite recevoir les informations des partenaires de Illico</Field>,
              <Form.Button>Je m’inscris</Form.Button>,
              <Link href="/cgv">
                En cliquant sur « Je m'inscris », vous confirmez que vous acceptez les <b>Conditions générales d'utilisations</b>.
              </Link>,
              <Link href="/sign-in">Vous êtes déjà inscrit ? <b>Connectez-vous</b></Link>
            ]}
            
            {isForgot && [
              <Form.Button>Récupérer</Form.Button>,
              <Link href="/sign-in">Revenir à l'écran de <b>Connexion</b></Link>
            ]}

          </Form>
        </div>
      </div>
    )
  }
}