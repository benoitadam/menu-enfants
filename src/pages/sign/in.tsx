import { h, Component } from 'preact'
import Main from 'containers/main'
import Sign from 'components/sign'

export default class SignInPage extends Component<any, any> {
  render() {
    return (
      <Main anonymous>
        <Sign />
      </Main>
    )
  }
}