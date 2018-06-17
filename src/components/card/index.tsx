import { h, Component } from 'preact'
import { cls } from 'services/helper';
import './style.css'

interface Props { class?, className?, children?, title?: string }
interface State {}
export default class Card extends Component<Props, State> {

  static Buttons = ({ children, ...rest }: { class?, className?, children? }) =>
    <div class={cls(rest, 'card_buttons')}>{children}</div>
  
  render({ title, children, ...rest }: Props, {}: State) {
    return (
      <div class={cls(rest, 'card')}>
        {title && <div class="card_title">{title}</div>}
        <div class="card_content">{children}</div>
      </div>
    )
  }
}