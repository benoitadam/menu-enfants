import { h, Component } from 'preact'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'preact-router/match'
import Icon from 'components/icon'
import { cls } from 'services/helper'
import './style.css'

export interface LinkProps {
  className?
  class?
  children?
  onClick?: (e) => void
  href?: string
  disabled?: boolean
}
interface State {}
export default class Link extends Component<LinkProps, State> {
  onClick = (e) => {
    if (this.props.onClick) {
      e.preventDefault()
      this.props.onClick(e)
    }
  }
  
  render({ href, onClick, disabled, children, ...rest }: LinkProps, {}: State) {
    return (
      <RouterLink  class={cls(rest, 'link', disabled&&'disabled')} activeClassName="active" href={href} onClick={this.onClick} {...rest}>
        {children}
      </RouterLink>
    )
  }
}