import { h, Component } from 'preact'
import Main from 'containers/main'
import Card from 'components/card'
import Button from 'components/button'
import { subscriptions, persistenceState } from 'services/helper'
import { auth$ } from 'services/api'
import importDb, { modelId } from 'models/db'
import User from 'models/User'
import Company from 'models/Company'
import Form from 'components/form'
import Field from 'components/field'
import Help from 'components/help'
import { route } from 'preact-router'
import Table, { IColumn } from 'components/table'
import Routes from 'services/routes';

const companyColumns: IColumn<Company>[] = [
  { title: 'Statut', key: 'status' },
  { title: 'Nom', key: 'name' },
  { title: 'SIRET', key: 'siret' },
  { title: 'Capital', key: 'capital' },
]

interface Props {}
interface State {
  userId?: string
  user?: User
  companies?: Company[]
}
export default class BeginPage extends Component<Props, State> {
  state: State = persistenceState(this, {})
  
  componentWillMount() {
    subscriptions(this).add(
      auth$.subscribe(async ({ user, id }) => {
        this.setState({ user, userId: id })

        // Get companies
        const db = await importDb()
        db.companies.getByUser(id).then(companies => this.setState({ companies }))
      })
    )
  }

  componentWillUnmount() {
    subscriptions(this).unsubscribe()
  }
  
  onCompanyAdd = async (e) => {
    e.preventDefault()
    const userId = auth$.value.id
    const db = await importDb()
    const company = await db.companies.set({ userId })
    console.log('company', company)
    Routes.company(company._id)
  }
  
  onCompanySelect = async (company: Company) => {
    console.log('company', company)
    Routes.company(company._id)
  }
  
  onUserValidate = async (user: User, changes: User, count: number) => {
    console.log('onUserValidate', user)
    if (count > 0) {
      const db = await importDb()
      changes._id = this.state.userId
      await db.users.merge(changes)
    }
  }

  render({}: Props, { user, companies }: State) {
    return (
      <Main>
        <Card title="Mes entreprises">
          {companies && companies.length > 0 &&
            <Table
              rowKey={modelId}
              columns={companyColumns}
              data={companies}
              onSelect={this.onCompanySelect}
            />
          }
          <Card.Buttons>
            <div />
            <Button primary onClick={this.onCompanyAdd}>Ajouter une entreprise</Button>
            <div />
          </Card.Buttons>
        </Card>
        <Card title="Information personnel">
          <Form values={user} onValidate={this.onUserValidate}>

            <Field name="email" label="E-Mail" type="email" required />
            <Field type="input" name="address" label="Adresse" autoComplete="address-line1" />
            <Field type="input" name="zip" label="Code postal" autoComplete="postal-code" />
            <Field type="input" name="country" label="Ville" autoComplete="country" />
            <Field type="tel" name="tel" label="Telephone" autoComplete="tel" />
            <Field type="select" name="civility" label="Civilité" options={{ O: '', M: 'Monsieur', W: 'Madame' }} autoComplete="sex" />
            <Field type="input" name="firstName" label="Prénom" autoComplete="name" />
            <Field type="input" name="lastName" label="Nom de famille" autoComplete="family-name" />
            <Field type="checkbox" name="optin">Oui, je souhaite recevoir les informations de Illico</Field>
            <Field type="checkbox" name="optinPartner">Oui, je souhaite recevoir les informations des partenaires de Illico</Field>

          </Form>
        </Card>
      </Main>
    )
  }
}