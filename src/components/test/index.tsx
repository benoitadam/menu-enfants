import { h, Component } from 'preact'
import { cls } from 'services/helper';
import './style.css'

interface Props { class?, className?, children? }
interface State {}
export default class Test extends Component<Props, State> {
  render({ children, ...rest }: Props, {}: State) {
    return (
      <div class={cls(rest, 'test')}>
        {children}
      </div>
    )
  }
}