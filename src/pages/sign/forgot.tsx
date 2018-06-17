import { h, Component } from 'preact'
import Main from 'containers/main'
import Sign from 'components/sign';

export default class SignForgotPage extends Component<any, any> {
  render() {
    return (
      <Main anonymous>
        <Sign isForgot />
      </Main>
    )
  }
}