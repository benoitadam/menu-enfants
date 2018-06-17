import { h, Component } from 'preact'
import { cls } from 'services/helper';
import './style.css'

interface Props { class?, className?, children? }
interface State {}
export default class Help extends Component<Props, State> {
  render({ children, ...rest }: Props, {}: State) {
    return (
      <div class={cls(rest, 'help')}>
        {children}
      </div>
    )
  }
}

export const HelpRating = ({children}: {children?}) => <div class="help_rating">{children}</div>

export const HelpRatingTotal = ({children}: {children?}) => <div class="help_rating_total">{children}</div>

interface HelpBlockProps { children?, header }
interface HelpBlockState { open?: boolean }
export class HelpBlock extends Component<HelpBlockProps, HelpBlockState> {

  onClick = () => {
    this.setState({ open: !this.state.open })
  }

  render({ children, header }: HelpBlockProps, { open }: HelpBlockState) {
    return (
      <div class="help_block">
        <div class="help_block_title" onClick={this.onClick}>
          {header}
        </div>
        {open && (
          <div class="help_block_content">
            {children}
          </div>
        )}
      </div>
    )
  }
}