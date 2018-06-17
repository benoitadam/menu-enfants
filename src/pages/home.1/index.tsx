import { h, Component } from 'preact'
import Main from 'containers/main'
import Help, { HelpRating, HelpRatingTotal, HelpBlock } from 'components/help'
import Button from 'components/button'
import MdCreateNewFolder from 'preact-icons/lib/md/create-new-folder'
import MdEuroSymbol from 'preact-icons/lib/md/euro-symbol'
import MdEvent from 'preact-icons/lib/md/event'
import MdSearch from 'preact-icons/lib/md/search'
import MdEmail from 'preact-icons/lib/md/email'
import MdInsertChart from 'preact-icons/lib/md/insert-chart'
import './style.css'

const background1 = '/images/Home1.jpg'

export default class HomePage extends Component<any, any> {
  render() {
    return (
      <Main class="home" anonymous={true} help={(
        <Help>
          <h1>Comment ça marche ?</h1>
          <HelpRating>
            <h2>Avis client</h2>
            <HelpRatingTotal>(4,8/5) 628 avis clients</HelpRatingTotal>
            « Une grande équipe de professionnels disponibles, réactifs, efficaces. Un rapport qualité/prix excellent pour des TPE et PME qui souhaitent créer rapidement leur société sans avoir de connaissance juridique et un budget serré. »
          </HelpRating>
          <HelpBlock header="Qui peut être actionnaire d'une SASU ?">
            <p>Si vous n'êtes pas dans l'un des deux cas ci-dessous, il est recommandé de consulter votre conseil habituel ou l’un de nos avocats partenaires:</p>
          </HelpBlock>
          <HelpBlock header={<b>Comment créer une SASU ?</b>}>
            <p>Le fondateur effectue un apport au capital et, en contrepartie, reçoit des actions de la société.</p>
          </HelpBlock>
          <HelpBlock header="Fondateur personne morale : assurez-vous que le signataire est le bon">
            <p>Lorsque l’associé unique est une société, indiquez le nom du représentant légal de la société (tel que mentionné sur l’extrait K-bis) ou le nom du bénéficiaire d’une délégation de pouvoirs valablement donnée par le représentant légal. A noter: une SASU peut valablement être actionnaire unique d'une autre SASU.</p>
          </HelpBlock>
        </Help>
      )}>

        <section class="home_top">
          <div class="home_top_content">
            <div class="home_top_title">
              Illico gère toutes vos formalités comptables.
              <br />
              Plus simple, plus rapide, moins cher.
            </div>
            <p>Vous souhaitez :</p>
            <div class="home_top_buttons">
              <Button class="home_top_button"><MdCreateNewFolder /><i>Créer une</i><b>entreprise</b></Button>
              <Button class="home_top_button"><MdEuroSymbol /><i>Gérez vos</i><b>factures</b></Button>
              <Button class="home_top_button"><MdEvent /><i>Voir le</i><b>calendrier</b></Button>
              <Button class="home_top_button"><MdSearch /><i>Récupèrer un</i><b>document</b></Button>
              <Button class="home_top_button"><MdEmail /><i>Accéder à votre</i><b>messagerie</b></Button>
            </div>
            <div class="home_top_chart">
              <MdInsertChart />
              Tableau de bord
            </div>
          </div>
        </section>
        
        <section class="home_rating">
          <div class="home_rating_title">95% des entrepreneurs<br />nous font confiance pour gérer leurs comptabilités.</div>
        </section>

        <section class="home_how">
          <div class="home_how_title">Comment ça marche ?</div>
        </section>

        <section class="home_example">
          <div class="home_example_title">"J’ai utilisé Illico pour commander des huitres à Noël. En moins de 20 minutes, j’ai reçu la facture parfaitement adaptée à ma commande d'huitre pour un coût très économique."</div>
          <div class="home_example_author">BENOIT DE HORIZIO</div>
        </section>

        <section class="home_footer">
          <div class="home_footer_title">Inscrivez-vous à notre newsletter</div>
        </section>

      </Main>
    )
  }
}