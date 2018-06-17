import { h, Component } from 'preact'
import { cls, subscriptions } from 'services/helper';
import './style.css'

interface Props {
  class?
  className?
  children?
  desc?: string
  step?: number
  active?: boolean
  ok?: boolean
}
interface State {}
export default class Step extends Component<Props, State> {
  onClick = (e) => {
    e.preventDefault()
    this.context.steps.setStep(this.props.step)
  }

  render({ children, ok, active, ...rest }: Props, {}: State) {
    return (
      <div class={cls(rest, 'step', active&&'step-active', ok&&'step-ok')} onClick={this.onClick}>
        <div class="step_ball" />
        <div class="step_content">
          {children}
        </div>
      </div>
    )
  }
}