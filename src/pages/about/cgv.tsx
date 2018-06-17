import { h, Component } from 'preact'
import Main from 'containers/main'

export default class CgvPage extends Component<{}, {}> {
  render() {
    return (
      <Main anonymous>
        <h1>Conditions générales d'utilisations.</h1>
        <p style={{ fontSize: '30%' }}>Les mêmes conditions que Facebook : Vous accepter qu'illico revendent vos données aux Américains pour de l'argent. Merci de cotre compréhension.</p>
      </Main>
    )
  }
}