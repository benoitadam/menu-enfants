import { h, Component } from 'preact'
import Link, { LinkProps } from 'components/link'
import { cls } from 'services/helper'
import './style.css'

export interface ButtonProps extends LinkProps {
  primary?: boolean
  icon?: any
}

export default class Button extends Component<ButtonProps, {}> {
  render({ primary, icon, children, ...rest }: ButtonProps) {
    return (
      <Link class={cls(rest, 'btn', primary?'btn-primary':'')} {...(rest as any)}>
        {icon}
        {children}
      </Link>
    )
  }
}


// interface Props {
//   class?
//   className?
//   children?
//   type?: 'submit'|'link'|'reset'
//   icon?: string
//   onClick?: (e) => void
//   href?: string
// }
// interface State {

// }
// export default class Button extends Component<Props, State> {
//   onClick = (e) => {
//     if (this.props.onClick) {
//       e.preventDefault()
//       this.props.onClick(e)
//     }
//   }
  
//   render({ type, href, onClick, icon, children }: Props, {}: State) {
//     return (
//       <Link class={cls('btn', this, type?'btn-'+type:null)} type={type} activeClassName="active" href={href} onClick={onClick}>
//         {icon && <Icon type={icon} />}
//         {children}
//       </Link>
//     )
//   }
// }