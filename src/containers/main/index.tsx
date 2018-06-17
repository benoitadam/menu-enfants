import { h, Component } from 'preact'
import Header from 'components/header'
import { subscriptions } from 'services/helper'
import { auth$ } from 'services/api'
import { route } from 'preact-router'
import Sign from 'components/sign'
import Help, { HelpBlock } from 'components/help'
import './style.css'

//const LocaleProvider2: any = LocaleProvider

interface MainProps {
  class?: string
  anonymous?: boolean
  help?: JSX.Element
}
interface MainState {
  isSlideCollapsed?: boolean,
  isAuthenticated: any
}
export default class Main extends Component<MainProps, MainState> {

  state = {
    isSlideCollapsed: false,
    isAuthenticated: auth$.getValue().isAuthenticated,
  }

  componentDidMount() {
    subscriptions(this).add(
      auth$.subscribe(({ isAuthenticated }) => {
        this.setState({ isAuthenticated })
      })
    )
  }
  
  componentWillUnmount() {
    subscriptions(this).unsubscribe()
  }

  handleHelpClick = (_e) => {
    this.setState(prev => ({
      isSlideCollapsed: !prev.isSlideCollapsed
    }));
  }
  
  render({ children, help, anonymous }, { isSlideCollapsed, isAuthenticated }) {
    if (help === undefined) {
      help = (
        <Help>
          <h1>Lorem ipsum dolor sit amet</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <HelpBlock header="Lorem Ipsum">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </HelpBlock>
          <HelpBlock header="De Finibus Bonorum et Malorum">
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
          </HelpBlock>
          <HelpBlock header="De Finibus Bonorum et Malorum">
            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
          </HelpBlock>
        </Help>
      )
    }
    return (
      <div class={`main ${this.props.class||''}`}>
        <Header handleHelpClick={this.handleHelpClick} />
        <div class="main-body">
          <div class="main-ctn">
            {isAuthenticated || anonymous ? children : <Sign />}
          </div>
          {(help && !isSlideCollapsed) && 
            <div class="side">
              {help}
            </div>
          }
        </div>
      </div>
    )
  }
}