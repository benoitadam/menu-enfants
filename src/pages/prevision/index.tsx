import { h, Component } from 'preact'
import Main from 'containers/main'
import Form from 'components/form'
import Field from 'components/field'
import Company from 'models/company'
import Card from 'components/card'
import Steps from 'components/steps'
import Step from 'components/steps/step'
import Help from 'components/help'
import importDb, { modelId } from 'models/db'
import { route } from 'preact-router'
import { persistenceState, toDico, toDicoMap, toArray } from 'services/helper'
import Button from 'components/button'
import moment from 'moment'
import Prevision from 'models/prevision'
import Routes from 'services/routes'
import Table, { IColumn } from 'components/table'
import Loading from 'components/loading'
import api from 'services/api';

interface Props {
  companyId?: string
}
interface State {
  previsions?: Prevision[]
  step?: number
  columns?: IColumn<Prevision>[]
}
export default class CompanyPage extends Component<Props, State> {
  state: State = {
    previsions: null,
    step: 0
  }
  form: Form

  constructor(props) {
    super(props)
    
    // this.typeColumns = [{
    //   title: 'Type',
    //   dataIndex: 'type',
    //   width: '50%',
    //   render: (text, record) => (
    //     <SelectStyled
    //       defaultValue={text}
    //       placeholder="Recherche"
    //       onChange={(value) => this.onTypeChanged(value, record)}
    //     >
    //       {this.types.map(v => <Option key={v.value}>{v.value}: {v.text}</Option>)}
    //     </SelectStyled>
    //   )
    // }, {
    //   title: 'Objet',
    //   dataIndex: 'desc',
    //   width: '50%',
    //   render: (text, record) => (
    //     <InputStyled value={text} onChange={(e) => this.onDescChanged(e.target.value, record)} />
    //   )
    // }];
  }

  async componentWillMount() {
    const { companyId } = this.props
    const db = await importDb()
    const previsions = await db.previsions.repo(companyId).items()
    if (!previsions.find(p => p.type === null)) {
      previsions.push({ type: null })
    }
    this.setState({
      previsions
    })
  }

  onStepChange = async (step) => {
    console.log('onStepChange')
    this.setState({
      step
    })
  }

  setForm = (form) => {
    if (form) this.form = form
  }

  onChange = async (i: number, row: Prevision, col: IColumn<Prevision>, value: any) => {
    console.log('onChange', i, row, col)
    const { previsions } = this.state
    const { companyId } = this.props

    const db = await importDb()
    const repo = db.previsions.repo(companyId)

    if (row.type) {
      repo.set(row)
    } else {
      repo.delete(row)
    }

    if (!previsions.find(p => p.type === null)) {
      previsions.push({ type: null })
      this.setState({ previsions })
    }
  }
  
  stepRender(step: number, previsions: Prevision[]) {
    if (step < 5) {
      const currentTypes = types.filter(v => v.step === step)
      const filter = toDicoMap(currentTypes, t => t.value, t => true)
      const options = currentTypes.map(t => [t.value, t.text] as [string, string])
      options.unshift([null, null])
      const columns: IColumn<Prevision>[] = [
        { title: 'Type', width: '40%', render: 'select', options, key: 'type' },
        { title: 'Description', width: '60%', render: 'input', key: 'desc' },
      ]
      const rows = previsions.filter(({type}) => type === null || filter[type])
      return (
        <Table
          rowKey={modelId}
          columns={columns}
          data={rows}
          onChange={this.onChange}
        />
      )
    } else {
      const typeTexts = toDicoMap(types, t => t.value, t => t.text)
      const columns: IColumn<Prevision>[] = [
        { title: 'Description', key: 'desc', get: p => p.desc || typeTexts[p.type] },
      ]
      for (let i=0; i<12; i++) {
        columns.push({
          title: (i + 1).toString(),
          key: i.toString(),
          width: '7%',
          render: 'number',
          get: p => p.months[i],
          set: (p, value) => p.months[i] = value,
        })
      }
      const rows = previsions.filter(p => typeTexts[p.type]).map(p => {
        p.months = toArray(p.months, null, 12)
        return p
      })
      return (
        <Table
          rowKey={modelId}
          columns={columns}
          data={rows}
          onChange={this.onChange}
        />
      )
    }
  }

  helpRender(step) {
    switch(step) {
      case 0: return (
        <Help>
          <p>Bienvenue dans la procédure qui va vous permettre de « travailler » votre projet d’entreprise et qui va vous inviter (si besoin est…) à « mettre de l’ordre dans vos idées ».<br />
          Nous savons que votre première ambition est de faire effectivement le métier que vous avez choisi et que, sans doute, vous n’êtes pas familier avec les comptes et la gestion… Nous allons essayer de vous donner la possibilité d’y entrer « quand même » !</p>
          <p>En premier lieu, rappelez-vous que <em>vous êtes déjà un <strong>gestionnaire</strong></em> (même si vous ne le mesuriez pas jusqu’à présent…) puisque vous êtes habitué à « gérer » votre budget personnel ou familial… et ceci va vous permettre de faire un parallèle avec la gestion d’entreprise.</p>
          <p>Chaque année, vous avez des dépenses <em>régulières</em> (par exemple : loyer, téléphone, essence, courses au centre commercial, les impôts…).<br />
          Dans votre entreprise, ces dépenses régulières s’appelleront des « <strong>Charges</strong> »</p>
          <p>Plus occasionnellement, vous avez des <em>grosses dépenses</em> qui sont nécessaires à votre quotidien et qui représentent des achats de biens qui « durent » davantage qu’un moment ou même qu’une année (par exemple : voiture, télévision, machine à laver, maison ou appartement …).<br />
          Dans votre entreprise ces dépenses importantes et <em>irrégulières</em> s’appelleront des « <strong>Investissements</strong> » ou encore des « <strong>Immobilisations</strong> »</p>
          <p>Chaque année, vous avez des rentrées <em>régulières</em> (par exemple : salaire, pension, RMI, allocation CAF…).<br />
          Dans votre entreprise, ces rentrées régulières s’appelleront des « <strong>Produits</strong> »<br />
          (nous parlerons plus loin de vos rentrées <em>irrégulières ou exceptionnelles</em> (gain au Loto ou au Tiercé…)</p>
          <p>Lorsque vous décidez d’acheter un bien « qui coûte cher », vous faites des économies sur vos rentrées pour pouvoir le payer dès l’achat, ou vous faites un emprunt auprès de votre banque … Ou encore vous faites un mélange des deux.<br />
          Dans l’entreprise, il s’agira de réaliser un « bénéfice » (<strong>Produits - Charges</strong>) pour disposer de réserves et/ou de faire un emprunt auprès de la banque.</p>
          <p>Comprenez que :</p>
          <p>sur le plan personnel, vos « <strong>Investissements</strong> » structurent et définissent votre « <strong>Cadre de vie</strong> » et que, sur le plan professionnel de votre entreprise, les « <strong>Investissements</strong> » structurent et définissent votre « <strong>Outil de travail</strong> ».</p>
          <p>sur le plan personnel, vos « <strong>Dépenses régulières</strong> »  et vos « <strong>Rentrées régulières</strong> »  représentent « le <strong>Fonctionnement de votre Cadre de vie</strong> » et que, sur le plan professionnel de votre entreprise, les « <strong>Charges</strong> » et les « <strong>Produits</strong> »  représentent  le « <strong>Fonctionnement de votre Outil de travail</strong> ».<br />
          Des différences majeures entre votre cadre personnel et le cadre de votre future entreprise sont : le vocabulaire (vous allez devoir vous familiariser avec des mots « nouveaux »… Marchandises, Charges sociales, Taxe professionnelle, TVA, Stocks, Amortissements…) et les masses financières que vous allez gérer mensuellement</p>
          <p>En vous laissant guider, vous allez réaliser :</p>
          <ul>
          <p>« <strong>le prévisionnel de <em>constitution et de financement</em> de votre futur outil de travail</strong> »</p>
          <p>« <strong>le prévisionnel de <em>fonctionnement</em> de votre futur outil de travail</strong> » sur 12 mois. Ce document s’appelle « <em>Prévisionnel du Compte de Résultat</em> ».</p>
          </ul>
          <p>Pour faciliter votre travail, la procédure va vous indiquer les noms (même s’ils sont un peu ou beaucoup incompréhensibles…) des différents postes comptables que vous allez utiliser. Mais elle va aussi vous donner des indications sur « ce que sont ses postes » pour vous permettre <strong>de les remplacer par des mots que vous aurez choisis vous-mêmes… et qui représente plus clairement <em>votre projet</em>.</strong><br />
          <strong>ainsi, vous travaillerez ensuite seulement avec « vos mots à vous »</strong>.</p>
          <p>Si vous êtes prêt(e), cliquez sur suivant.</p>
        </Help>
      )
      case 1: return (
        <Help>
          <p>Cliquez dans la zone <strong>Type</strong> pour sélectionner le poste <strong>Marchandises</strong>.</p>
          <p>Les « Marchandises » sont les produits que vous achetez pour les revendre avec ou sans transformation : par exemple un restaurant va acheter des « Alcools », des « Vins », des « Boissons sans Alcools » qu’il revend « en l’état », mais aussi des  « Denrées alimentaires » pour faire ses plats.</p>
          <p><strong>Par contre, les sets de table, les nappes, les couverts… ne sont pas des « Marchandises », car il ne les vend pas en tant que tels.</strong></p>
          <p><strong>NB 1</strong> : il se peut qu’il n’y ait pas de postes « Marchandises » dans votre activité ! Par exemple, un Architecte n’achète rien pour le revendre. Il facture son intervention, mais ne vend pas des objets. Dans ce cas, passez à l’étape suivante sans rien inscrire.</p>
          <p><strong>NB 2</strong> : un réparateur de télévisions intervient parfois en « remettant en marche » sans changer une pièce de l’appareil. Dans ce cas, il facture seulement sa prestation de « main d’œuvre » sans vendre une marchandise. D’autres fois, il répare l’appareil en changeant un composant. Sa facture sera composée d’une part, d’une fourniture de pièce (il vend donc une marchandise) et d’autre part, de « main d’œuvre ».</p>
          <p>Pensez aux factures que vous serez appelé à faire vous-même, et raisonnez sur les grandes catégories de marchandises qui concernent votre activité.</p>
          <p><strong>Cliquez ensuite dans la zone Objet</strong> pour taper ces grandes catégories de Marchandises liées à votre activité… Choisissez un titre simple et court, facile à comprendre et à retrouver lorsque vous le rencontrerez plus tard.<br />
          Si vous avez plusieurs types de marchandises à inscrire, renouvelez l’opération sur autant de lignes que nécessaire.</p>
        </Help>
      )
      case 2: return (
        <Help>
          <p>Cliquez dans la zone  Type.</p>
          <p>Un choix vous est proposé parmi les Postes suivants : ---- Achats de Prestations de Services (liées aux produits fabriqués).</p>
          <ul>
            <li>Eau, EDF, Gaz.</li>
            <li>Petit Matériel</li>
          </ul>
          <p>Voici ce dont il s’agit :</p>
          <p>Achats de Prestations de Services (liées aux produits fabriqués)</p>
          <p>Pensez à un menuisier qui fabrique des chaises et des tables en bois. S’il s’occupe lui-même de les vernir ou de les peindre, il n’aura pas besoin de prestations de services « extérieures » et ce poste n’aura donc pas à être retenu.<br />
          Si par contre, il fait faire cette action par un prestataire extérieur, il retiendra ce poste pour tenir compte du coût direct de ce prestataire sur les produits qu’il vend.</p>
          <p>Eau, EDF, Gaz</p>
          <p>Ce poste concerne les énergies. Vous pouvez faire un poste global pour les trois ou les séparer… Surtout si votre projet est un point de lavage de voitures… ou un restaurant entièrement équipé d’appareils électriques…</p>
          <p>Petit Matériel</p>
          <p>Ce poste concerne les fournitures diverses, consommables d’un faible montant unitaire, qui ne sont pas des « marchandises » que vous revendez, mais dont vous avez tout de même besoin pour travailler… Par exemple des stylos, des feuilles de papier, des vis, des clous, du papier d’emballage, etc.</p>
        </Help>
      )
      case 3: return (
        <Help>
          <p>Cliquez dans la zone  Type.</p>
          <p>Un choix vous est proposé parmi les Postes suivants :</p>
          <ul>
            <li>Crédit Bail.<br />
            Ce poste est pour le cas ou vous projetez d’acheter un équipement en Crédit Bail ou en Leasing (C’est un point un peu « particulier »… appelez-nous pour en parler…)</li>
            <li>Loyer.<br />
            Ce poste est pour le loyer de votre bureau, de votre atelier ou du fonds de commerce que vous allez acheter ou louer.</li>
            <li>Charges locatives<br />
            Ce poste est pour les charges qui vont avec le loyer et qui seront perçues par le propriétaire.<br />
            .- Assurances.<br />
            Ce poste mérite une réflexion particulière. Demandez-vous quels genres de risques vous devez couvrir et quels genres de réponses peuvent vous apporter un assureur (sans oublier que c’est aussi un commerçant comme vous…). S’il est vrai qu’une assurance « Risques d’exploitation » n’est pas forcément indispensable au début de votre activité, par contre il ne faut pas négliger l’assurance responsabilité civile qui va couvrir les risques d’accident de vos clients ou encore l’assurance qui couvre votre bureau ou votre local.<br />
            Autre exemple : l’assurance Dommages Ouvrage (Garantie décennale) est indispensable si votre projet est dans le bâtiment…</li>
            <li>Documentation technique.<br />
            Ce poste est pour les documents ou les abonnements qui vous seront utiles pour mieux maîtriser les techniques ou les informations propres à l’exercice de votre activité.</li>
            <li>Honoraires<br />
            Ce poste est pour les services que vous payez en honoraires : Comptable, Avocat, Notaire…</li>
            <li>Publicité<br />
            Ce poste est pour les actions que vous envisagez pour vous faire connaître : annonces dans les journaux, prospectus, spots radio locaux… ou même (vous avez le droit de rêver) pubs à la télévision.</li>
            <li>Frais de Déplacement.<br />
            Ce poste est pour vos déplacements professionnels, que ce soit pour livrer vos clients ou pour prospecter : essence pour votre voiture, repas au restaurant en déplacements</li>
            <li>Frais postaux et Télécommunications.<br />
            Ce poste est pour vos frais de courriers ou de téléphone ou encore d’Internet.</li>
            <li>Frais Compte bancaire<br />
            Ce poste est pour les frais que va compter votre banquier sur votre compte. Pour information, une trésorerie mal en point avec des incidents de paiements (découverts, chèques sans provision suffisante) va engendrer des frais qui peuvent être importants. Mais sachez aussi qu’une trésorerie opulente entraîne aussi des « frais » du style (parmi nos préférés…) « Commission de mouvement » dont vous ne comprendrez jamais le calcul, mais qui sera pourtant bien débitée sur votre compte.<br />
            Renseignez-vous auprès des banquiers (sans oublier qu’ils sont aussi des commerçants comme vous…).</li>import Prevision from './../../models/prevision';

            <li>Concours divers (Cotisations…)<br />
            Ce poste est pour les cotisations ou adhésions obligatoires ou facultatives en lien avec votre activité. Par exemple un Architecte doit obligatoirement cotiser à l’Ordre des Architectes… un restaurateur ou un boulanger peut choisir, s’il le souhaite, d’adhérer à un groupement ou à un syndicat professionnel.</li>
          </ul>
        </Help>
      )
      case 4: return (
        <Help>
          <p>Cliquez dans la zone  Type.</p>
          <p>Un choix vous est proposé parmi les Postes suivants :</p>
          <ul>
            <li>Salaires.<br />
            Ce poste est pour le cas ou vous projetez d’avoir du personnel salarié. Pensez à votre projet et réfléchissez pour déterminer combien de collaborateurs vous aurez besoin et le temps de travail de chacun.<br />
            Tapez dans la zone  Objet un libellé court, mais descriptif. Par exemple Cuisinier, Serveur 1, Serveur 2, Ouvrier Maçon 1, Livreur 1, etc.<br />
            Dites vous que selon votre activité, vous ne pouvez pas fixer les éléments de rémunération comme bon vous semble. Il se peut que, dans votre domaine, une « Convention collective » existe. C’est un texte qui régit entre autres les éléments de salaires en fonction des qualifications des personnes que vous embauchez (joignez la Direction départementale du Travail pour savoir si votre domaine d’activité a une Convention collective).</li>
          </ul>
          <p>Ne soyez pas surpris de ne pas rencontrer dans la procédure que vous effectuez ici, des postes « Charges sociales »… Le programme va les calculer tout seul et les fera apparaître dans le résultat final.</p>
          <ul>
            <li>Rémunération exploitante (Gérant).<br />
            Ce poste est pour inscrire la rémunération que vous projetiez de vous verser en temps que Travailleur indépendant ou Assimilé travailleur indépendant.</li>
          </ul>
          <p>Si vous ne savez pas ce que cela veut dire, il est prudent de nous appeler pour en parler, car c’est un élément essentiel de votre projet économique.</p>
          <p>Surtout si vous ne faites pas la différence entre « Entreprises individuelles », EURL et SARL…</p>
        </Help>
      )
      case 5: return (
        <Help>
          <p>Cliquez dans la zone  Type.</p>
          <p>Un choix vous est proposé parmi les Postes suivants :</p>
          <ul>
            <li>Ventes de Marchandises.</li>
            <li>Études</li>
            <li>Prestations de Services</li>
            <li>Travaux</li>
          </ul>
          <p>Sélectionnez les postes qui concernent votre activité, en réfléchissant à la manière dont vous allez percevoir des recettes.</p>
          <p>Est-ce en vendant des marchandises et en faisant une marge sur ces ventes ? Si oui, comment allez-vous calculer cette marge ? avez-vous « enquêté » chez vos concurrents pour avoir une idée de leurs prix ? etc.</p>
          <p>Est-ce en vendant des études, des Prestations de Services ou  des Travaux ? Si oui, êtes-vous bien « clair » dans votre esprit pour savoir combien vont vous coûter la réalisation de ces services pour décider quelle marge vous allez facturer ?</p>
          <p>Si ces interrogations n’ont aujourd’hui aucune réponse en vous, considérerez simplement (mais vraiment !) que votre projet n’est pas encore assez « mûr »…<br />
          Mais que vous avez au moins les axes sur lesquels vous devez travailler…</p>
        </Help>
      )
      case 6: return (
        <Help>
          <p>Voici donc les postes que vous avez retenus.</p>
          <p>La colonne « 01 » désigne le premier mois ; la colonne « 02 » désigne le deuxième mois…</p>
          <p>Il s’agit maintenant de vous projeter dans votre activité future et d’inscrire des sommes, mois par mois, pour chaque rubrique.</p>
          <p>TODO Ajoutez des conseils ici…</p>
        </Help>
      )
    }
  }

  onCompanyClick = () => {
    const {companyId} = this.props
    Routes.company(companyId)
  }
  
  onPrintClick = () => {
    const {companyId} = this.props
    api.previsionReport(companyId)
  }

  render({}: Props, { step, previsions }: State) {
    return (
      <Main help={this.helpRender(step)}>
        <Card>
          <Steps
            current={step}
            onStepChange={this.onStepChange}
            startButton={
              <Button onClick={this.onCompanyClick}>Organisation</Button>
            }
            endButton={
              <Button primary onClick={this.onPrintClick}>Imprimer</Button>
            }
            steps={[
              <Step desc="Information légales de votre organisation">Marchandises</Step>,
              <Step desc="Adresse de votre organisation">Eau, EDF, Gaz</Step>,
              <Step desc="Informations du dirigeant">Loyer</Step>,
              <Step desc="Informations du dirigeant">Salaires</Step>,
              <Step desc="Informations du dirigeant">Ventes</Step>,
              <Step desc="Informations du dirigeant">Sommes</Step>,
            ]}
          >
            {!previsions ? <Loading /> : this.stepRender(step, previsions)}
          </Steps>
        </Card>
      </Main>
    )
  }
}


interface PrevisionType { step:number, value:string, text:string }

const types: PrevisionType[] = [
  { step:0, value:'60710', text:"Marchandises" },
  //////////////////////////////////////////////////////////////////////////////////////////
  { step:1, value:'60400', text:"Achats de Prestations de Services (Liées aux Produits Fabriqués)" },
  { step:1, value:'60610', text:"Eau, EDF, Gaz" },
  { step:1, value:'60630', text:"Petit Matériel" },
  //////////////////////////////////////////////////////////////////////////////////////////
  { step:2, value:'61610', text:"Assurances" },
  { step:2, value:'61500', text:"Charges Locatives" },
  { step:2, value:'62810', text:"Concours Divers (Cotisations…)" },
  { step:2, value:'61220', text:"Crédit-Bail" },
  { step:2, value:'61830', text:"Documentation Technique" },
  { step:2, value:'62780', text:"Frais Compte Bancaire" },
  { step:2, value:'62510', text:"Frais de Déplacements" },
  { step:2, value:'62600', text:"Frais Postaux et Télécommunications" },
  { step:2, value:'62260', text:"Honoraires" },
  { step:2, value:'61350', text:"Locations Mobilières" },
  { step:2, value:'61320', text:"Loyer" },
  { step:2, value:'62310', text:"Publicité" },
  //////////////////////////////////////////////////////////////////////////////////////////
  { step:3, value:'64510', text:"Cotisations à l'URSSAF" },
  { step:3, value:'64540', text:"Cotisations aux ASSEDIC" },
  { step:3, value:'64530', text:"Cotisations aux Caisses de Retraites" },
  { step:3, value:'64600', text:"Cotisations Personnelles de l'Exploitant" },
  { step:3, value:'64400', text:"Rémunération Exploitant (Gérant)" },
  { step:3, value:'64110', text:"Salaires" },
  //////////////////////////////////////////////////////////////////////////////////////////
  { step:4, value:'70500', text:"Etudes" },
  { step:4, value:'70600', text:"Prestations de Services" },
  { step:4, value:'70400', text:"Travaux" },
  { step:4, value:'70700', text:"Ventes de Marchandises" },
  //////////////////////////////////////////////////////////////////////////////////////////////
];

const typeByValue = toDico(types, p => p.value)

function getTypeText(value: string) {
  return (typeByValue[value] || {text:null}).text
}













// const COLUMNS: IColumn<Prevision>[] = [
//   { title: 'Année', value: i => i.year },
//   { title: 'Type', value: i => i.type },
//   { title: 'Description', value: i => i.desc },
//   { title: 'Mois', value: i => i.months },
// ]

// const DATA = [
//   { a:1, b:2 },
//   { a:2, b:3 },
//   { a:3, b:4 },
//   { a:4, b:5 },
//   { a:5, b:6 }
// ]

// const ROW_KEY = i => i._id

// interface Props {}
// interface State {
//   companyId?: string
//   previsions?: Prevision[]
//   step?: number
// }
// export default class PrevisionPage extends Component<Props, State> {


//   render({}: Props, {}: State) {
//     return (
//       <Main>
//         <Card title="Mettre de l’ordre dans vos idées">
//           <Steps
//             current={step}
//             onStepChange={this.onStepChange}
//             endButton={
//               <Button primary onClick={this.onPrevisionClick}>Prevision</Button>
//             }
//             steps={[
//               <Step desc="Information légales de votre organisation"><MdInfoOutline /> Information</Step>,
//               <Step desc="Adresse de votre organisation"><MdPlace /> Adresse</Step>,
//               <Step desc="Informations du dirigeant"><MdPerson /> Dirigeant</Step>,
//             ]}
//           >
//             {this.stepRender(formStep, company)}
//           </Steps>
//           <Table rowKey={ROW_KEY} data={DATA} columns={COLUMNS} />
//         </Card>
//       </Main>
//     )
//   }
// }