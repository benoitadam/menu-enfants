import { h, Component } from 'preact'
import Main from 'containers/main'
import Form from 'components/form'
import Field from 'components/field'
import Company from 'models/company'
import Card from 'components/card'
import Steps from 'components/steps'
import Step from 'components/steps/step'
import Help from 'components/help'
import MdInfoOutline from 'preact-icons/lib/md/info-outline'
import MdPlace from 'preact-icons/lib/md/place'
import MdPerson from 'preact-icons/lib/md/person'
import importDb from 'models/db'
import { persistenceState } from 'services/helper'
import Button from 'components/button'
import Routes from 'services/routes'

interface Props {
  companyId?: string
}
interface State {
  company?: Company
  step?: number
}
export default class CompanyPage extends Component<Props, State> {
  state = {
    company: null,
    step: 0
  }
  form: Form

  async componentWillMount() {
    const { companyId } = this.props
    const db = await importDb()
    // let company = db.companies.getCacheItem(companyId)
    // this.setState({ company })
    const company = await db.companies.get(companyId)
    this.setState({ company })
    
    // connect(this, {
    //   company: db.companies.getItem(companyId)
    // })
  }
  
  onStepChange = async (step) => {
    console.log('onStepChange')
    if (this.form) {
      await this.form.validate<Company>(async (company, changes, changesCount) => {
        const { companyId } = this.props
        console.log(company)
        // Save only if field value change
        if (changesCount > 0) {
          const db = await importDb()
          changes._id = companyId
          await db.companies.merge(changes)
        }
        if (step === 'previsions') {
          Routes.prevision(companyId)
          return
        }
        this.setState({ step, company })
      })
    }
  }

  setForm = (form) => {
    if (form) this.form = form
  }

  stepRender(step, company) {
    switch(step) {
      case 0: return (
        <Form key={0} busy={!company} values={company} ref={this.setForm} noButtons>
          <Field type="input" name="name" label="Nom de l’organisation" />
          <Field type="select" name="status" label="Statut" options={STATUS_OPTIONS} other />
          <Field type="input" len={15} name="siret" label="SIRET" />
          <Field type="number" name="capital" label="Capital social" addonAfter="€" />
          <Field type="day" name="creation" label="Date de création" />
          <Field type="day" name="cloture" label="Date de cloture des comptes" />
          <Field type="select" name="regime" label="Régime d’imposition" options={REGIME_OPTIONS} other />
        </Form>
      )
      case 1: return (
        <Form key={1} busy={!company} values={company} ref={this.setForm} noButtons>
          <Field type="input" name="address" label="Adresse" />
          <Field type="input" name="cp" label="Code postal" />
          <Field type="input" name="city" label="Ville" />
          <Field type="input" name="tel" label="Téléphone" />
        </Form>
      )
      case 2: return (
        <Form key={2} busy={!company} values={company} ref={this.setForm} noButtons>
          <Field type="select" name="civilite" label="Civilité" options={civiliteOptions} other />
          <Field type="input" name="firstName" label="Prénom" />
          <Field type="input" name="lastName" label="Nom (de famille)" />
          <Field type="day" name="naissance" label="Date de naissance" />
          <Field type="select" name="nationality" label="Nationalité" options={NATIONALITY_OPTIONS} other />
        </Form>
      )
    }
  }

  helpRender(step) {
    switch(step) {
      case 0: return (
        <Help>
          <h1>Information sur l'entrerprise</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis mollis nibh, eu efficitur est vulputate eu. Mauris sollicitudin cursus urna sit amet egestas. Duis ut consequat dui. Praesent pellentesque hendrerit lorem sit amet dignissim. Integer rhoncus rhoncus eros. In finibus nec sem et consequat. Aliquam magna ligula, accumsan non pretium nec, venenatis non orci. Integer a nibh ornare erat pharetra pharetra. Nulla facilisi.</p>
          <p>Pellentesque non posuere tellus, at mollis turpis. Pellentesque felis urna, convallis ut sodales ac, semper vitae erat. Ut sagittis justo non ligula lacinia, volutpat dictum nulla gravida. Nunc dignissim lectus metus, sit amet porttitor massa molestie vel. Aenean pretium pellentesque consectetur. Etiam blandit vestibulum dignissim. Curabitur suscipit, ligula non auctor lobortis, leo sem vulputate orci, sit amet pellentesque sem mi vitae nunc. Nunc faucibus euismod odio at tristique. Praesent bibendum finibus accumsan. Etiam et consequat justo, a congue sem. Aliquam vel ligula nec magna tincidunt commodo ut ac ipsum. Nulla in nibh eget ipsum tempor congue placerat eget sapien.</p>
        </Help>
      )
      case 1: return (
        <Help>
          <h1>Adresse de votre organisation</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis mollis nibh, eu efficitur est vulputate eu. Mauris sollicitudin cursus urna sit amet egestas. Duis ut consequat dui. Praesent pellentesque hendrerit lorem sit amet dignissim. Integer rhoncus rhoncus eros. In finibus nec sem et consequat. Aliquam magna ligula, accumsan non pretium nec, venenatis non orci. Integer a nibh ornare erat pharetra pharetra. Nulla facilisi.</p>
          <p>Pellentesque non posuere tellus, at mollis turpis. Pellentesque felis urna, convallis ut sodales ac, semper vitae erat. Ut sagittis justo non ligula lacinia, volutpat dictum nulla gravida. Nunc dignissim lectus metus, sit amet porttitor massa molestie vel. Aenean pretium pellentesque consectetur. Etiam blandit vestibulum dignissim. Curabitur suscipit, ligula non auctor lobortis, leo sem vulputate orci, sit amet pellentesque sem mi vitae nunc. Nunc faucibus euismod odio at tristique. Praesent bibendum finibus accumsan. Etiam et consequat justo, a congue sem. Aliquam vel ligula nec magna tincidunt commodo ut ac ipsum. Nulla in nibh eget ipsum tempor congue placerat eget sapien.</p>
        </Help>
      )
      case 2: return (
        <Help>
          <h1>Vos informations personnelles</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis mollis nibh, eu efficitur est vulputate eu. Mauris sollicitudin cursus urna sit amet egestas. Duis ut consequat dui. Praesent pellentesque hendrerit lorem sit amet dignissim. Integer rhoncus rhoncus eros. In finibus nec sem et consequat. Aliquam magna ligula, accumsan non pretium nec, venenatis non orci. Integer a nibh ornare erat pharetra pharetra. Nulla facilisi.</p>
          <p>Pellentesque non posuere tellus, at mollis turpis. Pellentesque felis urna, convallis ut sodales ac, semper vitae erat. Ut sagittis justo non ligula lacinia, volutpat dictum nulla gravida. Nunc dignissim lectus metus, sit amet porttitor massa molestie vel. Aenean pretium pellentesque consectetur. Etiam blandit vestibulum dignissim. Curabitur suscipit, ligula non auctor lobortis, leo sem vulputate orci, sit amet pellentesque sem mi vitae nunc. Nunc faucibus euismod odio at tristique. Praesent bibendum finibus accumsan. Etiam et consequat justo, a congue sem. Aliquam vel ligula nec magna tincidunt commodo ut ac ipsum. Nulla in nibh eget ipsum tempor congue placerat eget sapien.</p>
        </Help>
      )
    }
  }
  
  onBeginClick = () => {
    Routes.begin()
  }

  onPrevisionClick = () => {
    this.onStepChange('previsions')
  }

  render({}: Props, { step, company }: State) {
    return (
      <Main help={this.helpRender(step)}>
        <Card>
          <Steps
            current={step}
            onStepChange={this.onStepChange}
            startButton={
              <Button onClick={this.onBeginClick}>Mon compte</Button>
            }
            endButton={
              <Button primary onClick={this.onPrevisionClick}>Prevision</Button>
            }
            steps={[
              <Step desc="Information légales de votre organisation"><MdInfoOutline /> Information</Step>,
              <Step desc="Adresse de votre organisation"><MdPlace /> Adresse</Step>,
              <Step desc="Informations du dirigeant"><MdPerson /> Dirigeant</Step>,
            ]}
          >
            {this.stepRender(step, company)}
          </Steps>
        </Card>
      </Main>
    )
  }
}


const STATUS_OPTIONS = {
  SA: 'SA: Société Anonyme',
  SAS: 'SAS: Société par Actions Simplifiée',
  SASU: 'SASU: Société par actions simplifiée unipersonnelle',
  SARL: 'SARL: Société à responsabilité limitée',
  EURL: 'EURL: Entreprise unipersonnelle à responsabilité limitée',
  SCI: 'SCI: Société Civile Immobilière',
  EI: 'EI: Entreprise individuelle',
  EIRL: 'EIRL: Entreprise individuelle à responsabilité limitée',
  MICRO: 'Micro-entreprise',
  AUTO: 'Auto-entreprise'
}


const REGIME_OPTIONS = { 
  RSI: 'RSI: Régime simplifié d’imposition',
  RN: 'RN: Régime réel normal',
  RSA: 'RSA: Régime simplifié agricole',
  // BIC: 'BIC/IS: Impôts sur les bénéfices',
  // BNC: 'BNC: Régime d\'imposition des bénéfices non commerciaux',
  // BA: 'BA: Régime d\'imposition des bénéfices agricoles'
}


const NATIONALITY_OPTIONS = {
  'française': 'Française',
  'afghane': 'Afghane',
  'albanaise': 'Albanaise',
  'algérienne': 'Algérienne',
  'allemande': 'Allemande',
  'américaine': 'Américaine',
  'andorrane': 'Andorrane',
  'angolaise': 'Angolaise',
  'argentine': 'Argentine',
  'arménienne': 'Arménienne',
  'australienne': 'Australienne',
  'autrichienne': 'Autrichienne',
  'azerbaïdjanaise': 'Azerbaïdjanaise',
  'bahamienne': 'Bahamienne',
  'bahreinienne': 'Bahreinienne',
  'bangladaise': 'Bangladaise',
  'barbadienne': 'Barbadienne',
  'belge': 'Belge',
  'belizienne': 'Belizienne',
  'beninoise': 'Beninoise',
  'bhoutanaise': 'Bhoutanaise',
  'bielorusse': 'Bielorusse',
  'birmane': 'Birmane',
  'bissau-Guinéenne': 'Bissau-Guinéenne',
  'bolivienne': 'Bolivienne',
  'bosniaque': 'Bosniaque',
  'botswanaise': 'Botswanaise',
  'bouthanaise': 'Bouthanaise',
  'brésilienne': 'Brésilienne',
  'britannique': 'Britannique',
  'bruneienne': 'Bruneienne',
  'bulgare': 'Bulgare',
  'burkinabè': 'Burkinabè',
  'burundaise': 'Burundaise',
  'cambodgienne': 'Cambodgienne',
  'camerounaise': 'Camerounaise',
  'canadienne': 'Canadienne',
  'cap-verdienne': 'Cap-verdienne',
  'centrafricaine': 'Centrafricaine',
  'chilienne': 'Chilienne',
  'chinoise': 'Chinoise',
  'chypriote': 'Chypriote',
  'colombienne': 'Colombienne',
  'comorienne': 'Comorienne',
  'congolaise': 'Congolaise',
  'costaricaine': 'Costaricaine',
  'croate': 'Croate',
  'cubain': 'Cubain',
  'danoise': 'Danoise',
  'djiboutienne': 'Djiboutienne',
  'dominicaine': 'Dominicaine',
  'dominiquaise': 'Dominiquaise',
  'egyptienne': 'Egyptienne',
  'emirienne': 'Emirienne',
  'equato-guineenne': 'Equato-guineenne',
  'equatorienne': 'Equatorienne',
  'erythreenne': 'Erythreenne',
  'espagnole': 'Espagnole',
  'est-timoraise': 'Est-timoraise',
  'estonienne': 'Estonienne',
  'fidjienne': 'Fidjienne',
  'finlandaise': 'Finlandaise',
  'gabonaise': 'Gabonaise',
  'gambienne': 'Gambienne',
  'georgienne': 'Georgienne',
  'ghanéenne': 'Ghanéenne',
  'grecque': 'Grecque',
  'grenadienne': 'Grenadienne',
  'guatemaltèque': 'Guatemaltèque',
  'guinéenne': 'Guinéenne',
  'guyanienne': 'Guyanienne',
  'haïtienne': 'Haïtienne',
  'hondurienne': 'Hondurienne',
  'hongroise': 'Hongroise',
  'indienne': 'Indienne',
  'indonésienne': 'Indonésienne',
  'irakienne': 'Irakienne',
  'iranienne': 'Iranienne',
  'irlandaise': 'Irlandaise',
  'islandaise': 'Islandaise',
  'israélienne': 'Israélienne',
  'italienne': 'Italienne',
  'ivoirienne': 'Ivoirienne',
  'jamaïcaine': 'Jamaïcaine',
  'japonaise': 'Japonaise',
  'jordanienne': 'Jordanienne',
  'kazakh': 'Kazakh',
  'kenyane': 'Kenyane',
  'kirghiz': 'Kirghiz',
  'kiribatienne': 'Kiribatienne',
  'kittitienne-et-nevicienne': 'Kittitienne-et-nevicienne',
  'kosovare': 'Kosovare',
  'koweitienne': 'Koweitienne',
  'laotienne': 'Laotienne',
  'lesothane': 'Lesothane',
  'lettone': 'Lettone',
  'libanaise': 'Libanaise',
  'liberienne': 'Liberienne',
  'libyenne': 'Libyenne',
  'liechtensteinoise': 'Liechtensteinoise',
  'lituanienne': 'Lituanienne',
  'luxembourgeoise': 'Luxembourgeoise',
  'macédonienne': 'Macédonienne',
  'malaisienne': 'Malaisienne',
  'malawienne': 'Malawienne',
  'maldivienne': 'Maldivienne',
  'malgache': 'Malgache',
  'malienne': 'Malienne',
  'maltaise': 'Maltaise',
  'marocaine': 'Marocaine',
  'marshallaise': 'Marshallaise',
  'mauritanienne': 'Mauritanienne',
  'mauritienne': 'Mauritienne',
  'mexicaine': 'Mexicaine',
  'micronesienne': 'Micronesienne',
  'moldave': 'Moldave',
  'monégasque': 'Monégasque',
  'mongole': 'Mongole',
  'monténegrine': 'Monténegrine',
  'mozambicaine': 'Mozambicaine',
  'namibienne': 'Namibienne',
  'nauruane': 'Nauruane',
  'neerlandaise': 'Neerlandaise',
  'néo-zélandaise': 'Néo-zélandaise',
  'nepalaise': 'Nepalaise',
  'nicaraguayenne': 'Nicaraguayenne',
  'nigériane': 'Nigériane',
  'nigérienne': 'Nigérienne',
  'nord coréenne': 'Nord coréenne',
  'norvégienne': 'Norvégienne',
  'omanaise': 'Omanaise',
  'ouzbek': 'Ouzbek',
  'pakistanaise': 'Pakistanaise',
  'palau': 'Palau',
  'palestinienne': 'Palestinienne',
  'panameenne': 'Panameenne',
  'papouane-neoguineenne': 'Papouane-neoguineenne',
  'paraguayenne': 'Paraguayenne',
  'péruvienne': 'Péruvienne',
  'philippine': 'Philippine',
  'polonaise': 'Polonaise',
  'portoricaine': 'Portoricaine',
  'portugaise': 'Portugaise',
  'qatarienne': 'Qatarienne',
  'roumaine': 'Roumaine',
  'russe': 'Russe',
  'rwandaise': 'Rwandaise',
  'saint-lucienne': 'Saint-lucienne',
  'saint-marinaise': 'Saint-marinaise',
  'saint-vincentaise-et-grenadine': 'Saint-vincentaise-et-grenadine',
  'salomonaise': 'Salomonaise',
  'salvadorienne': 'Salvadorienne',
  'samoane': 'Samoane',
  'santomeenne': 'Santomeenne',
  'saoudienne': 'Saoudienne',
  'sénégalaise': 'Sénégalaise',
  'serbe': 'Serbe',
  'singapourienne': 'Singapourienne',
  'slovaque': 'Slovaque',
  'slovène': 'Slovène',
  'somalienne': 'Somalienne',
  'soudanaise': 'Soudanaise',
  'sri-lankaise': 'Sri-lankaise',
  'sud-africaine': 'Sud-africaine',
  'sud-coréenne': 'Sud-coréenne',
  'suédoise': 'Suédoise',
  'suisse': 'Suisse',
  'surinamaise': 'Surinamaise',
  'swazie': 'Swazie',
  'syrienne': 'Syrienne',
  'tadjik': 'Tadjik',
  'taïwanaise': 'Taïwanaise',
  'tanzanienne': 'Tanzanienne',
  'tchadienne': 'Tchadienne',
  'tchèque': 'Tchèque',
  'thaïlandaise': 'Thaïlandaise',
  'togolaise': 'Togolaise',
  'tonguienne': 'Tonguienne',
  'trinidadienne': 'Trinidadienne',
  'tunisienne': 'Tunisienne',
  'turkmene': 'Turkmene',
  'turque': 'Turque',
  'tuvaluane': 'Tuvaluane',
  'ukrainienne': 'Ukrainienne',
  'uruguayenne': 'Uruguayenne',
  'vanuatuane': 'Vanuatuane',
  'vénézuélienne': 'Vénézuélienne',
  'vietnamienne': 'Vietnamienne',
  'yemenite': 'Yemenite',
  'zambienne': 'Zambienne',
  'zimbabweenne': 'Zimbabweenne',
}

const civiliteOptions = {
  'H': 'Monsieur',
  'F': 'Madame',
}