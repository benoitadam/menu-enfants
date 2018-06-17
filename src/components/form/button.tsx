import { h, Component } from 'preact'
import { cls } from 'services/helper'
import { ButtonProps } from 'components/button'
import Button from 'components/button'
import Form from 'components/form'
import './style.css'

export interface FormButtonProps extends ButtonProps { reset?: boolean }
interface State {}
export default class FormButton extends Component<FormButtonProps, State> {
  context: { fields: Form }
  
  onClick = (e) => {
    if (this.props.reset) {
      this.context.fields.onReset(e)
    } else {
      this.context.fields.onSubmit(e)
    }
    if (this.props.onClick) this.props.onClick(e)
  }

  render({ reset, onClick, ...rest }: FormButtonProps, {}: State) {
    return (
      <Button primary={!reset} onClick={this.onClick} {...rest} />
    )
  }
}