import { h, Component } from 'preact'
import { cls } from 'services/helper'
import Button from 'components/button'
import MdNavigateBefore from 'preact-icons/lib/md/navigate-before'
import MdNavigateNext from 'preact-icons/lib/md/navigate-next'
import './style.css'

interface Props {
  class?
  className?
  children?
  steps?: JSX.Element[]
  current: number
  onStepChange: (step: number) => void
  startButton?: JSX.Element
  endButton?: JSX.Element
}
interface State {}
export default class Steps extends Component<Props, State> {
  setStep(value) {
    this.props.onStepChange(value)
  }

  getChildContext() {
    return { steps: this }
  }

  onPrevClick = () => {
    this.setStep(this.props.current - 1)
  }
  
  onNextClick = () => {
    this.setStep(this.props.current + 1)
  }
  
  render({ children, startButton, endButton, steps, current, ...rest }: Props, {}: State) {

    const spaceMargin = 50 / steps.length
    const widthDisp = (100 - spaceMargin * 2) / (steps.length - 1)
    const width = (spaceMargin + widthDisp * current) + '%'
    
    for (let i=steps.length; i--;) {
      const { attributes } = steps[i]
      attributes.step = i
      attributes.ok = i < current ? true : undefined
      attributes.active = i === current ? true : undefined
    }

    console.log('width', width, children, current)

    return (
      <div class={cls(rest, 'steps')}>
        <div class="steps_line" />
        <div class="steps_line-active" style={{ width }} />
        <div class="steps_steps">
          {steps}
        </div>
        <div class="steps_content">
          {children}
        </div>
        <div class="steps_buttons">
          {current <= 0 ? (startButton ? startButton : <div />) :
            <Button onClick={this.onPrevClick}><MdNavigateBefore /> Précédent</Button>
          }
          {current >= (steps.length - 1) ? (endButton ? endButton : <div />) :
            <Button primary onClick={this.onNextClick}>Continuer <MdNavigateNext /></Button>
          }
        </div>
      </div>
    )
  }
}