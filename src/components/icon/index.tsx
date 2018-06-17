import { h, Component } from 'preact'
import { cls } from 'services/helper';
import './style.css'

interface Props {
  class?
  className?
  children?
  icon?: any
  type?: string
}

//interface State {}
// export default class Icon extends Component<Props, State> {
//   render({ children, ...rest }: Props, {}: State) {
//     return (
//       <div class={cls(rest, 'test')}>
//         {children}
//       </div>
//     )
//   }
// }

const Icon = ({ icon, ...rest }: Props) => <i class={cls(rest, 'icon')}>{icon}</i>
export default Icon