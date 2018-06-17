import { h, Component } from 'preact'
import { subscriptions, toNumber, toString, toDate, toBoolean, cls } from 'services/helper'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import Button from 'components/button'
import Field, { IFieldContext } from 'components/field'
import FormButton from './button'
import './style.css'

type ValidateFunction<T> = (values: T, changes: T, changesCount: number) => Promise<void>

interface Props {
  class?: string
  className?: string
  values?: any
  onValidate?: ValidateFunction<any>
  //onValidateError?: (errors: any, values: any) => void
  onChange?: (key:string, value:any) => any
  errors?: { _?: string, [name:string]: string }
  noButtons?: boolean
  children?: any
  busy?: boolean
}
interface State {
  error: string
  busy: boolean
}
export default class Form extends Component<Props, State> implements IFieldContext {

  static Field = Field
  static Button = FormButton
  
  converters = {}
  values$: BehaviorSubject<any>
  errors$: BehaviorSubject<any>
  changes = {} as any
  rules: { [name:string]: ((v:any)=>string|undefined)[] } = {}

  constructor(props: Props) {
    super(props)
    this.values$ = new BehaviorSubject(props.values||{})
    this.errors$ = new BehaviorSubject(props.errors||{})
    
    this.state = {
      error: null,
      busy: props.busy
    }
    
    subscriptions(this).add(
      this.values$.subscribe(values => {
        console.log('values$ next', values)
        const errors = this.errors$.value
        for (const name in values) {
          const value = values[name]
          const rules = this.rules[name]
          if (rules === undefined) {
            continue
          }
          console.log('check', name, value, rules)
          for (const rule of rules) {
            const error = rule(value)
            if (error) {
              console.log('field error', name, value, rules, error)
              errors[name] = error
              break
            } else {
              delete errors[name]
            }
          }
        }
        this.errors$.next(errors)
      }),
      this.errors$.subscribe(errors => {
        const error = errors._
        if (error !== this.state.error) {
          this.setState({ error })
        }
      })
    )
  }

  componentWillUnmount() {
    subscriptions(this).unsubscribe()
  }
  
  getChildContext() {
    return {
      fields: this as IFieldContext
    }
  }
  
  setRules(name: string, rules: ((v:any)=>string|undefined)[]) {
    // console.log('setRules', name, rules)
    this.rules[name] = rules
  }

  setValue(name: string, value: any) {
    console.log('setValue', name, value)
    if (this.props.onChange) this.props.onChange(name, value)
    this.changes[name] = value
    this.values$.next({ ...this.values$.value, [name]: value })
  }

  async validate<T>(cb: ValidateFunction<T>) {
    this.setState({ busy: true })
    
    await cb(this.values$.value, this.changes, Object.keys(this.changes).length)
    .catch((err) => {
      console.error('onSubmit error', err)

      if (typeof err === 'object') {
        if (err instanceof Error) {
          this.errors$.next({ _: err.message })
          return
        }
        this.errors$.next(err)
        return
      }
      
      if (typeof err === 'string') {
        this.errors$.next({ _: err })
        return
      }
      
      this.errors$.next({ _: 'Une erreur inconnue est survenue' })
    })
    
    this.setState({ busy: false })
  }

  onSubmit = async (e) => {
    console.log('onSubmit', e)
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    if (this.props.onValidate) {
      this.validate(this.props.onValidate)
    }
  }

  onReset = (e) => {
    e.preventDefault()
    console.log('onReset')
    this.values$.next(this.props.values||{})
  }
  
  componentWillReceiveProps({ values, errors, busy }: Props) {
    console.log('componentWillReceiveProps', values, errors)
    if (this.props.busy !== busy) {
      this.setState({ busy })
    }

    if (values !== undefined && values !== this.props.values) {
      this.values$.next(values)
    }
    if (errors !== undefined && errors !== this.props.errors) {
      this.errors$.next(errors)
    }
  }
  
  render({ children, noButtons, ...rest }: Props, { error, busy }: State) {
    return (
      <form class={cls(rest, 'form')} onSubmit={this.onSubmit}>
        {error && <div class="form_error">{error}</div>}
        {children}
        {!noButtons &&
          <Field>
            <FormButton>Enregistrer</FormButton>
            <FormButton reset>Annuler</FormButton>
          </Field>
        }
        {busy && <div class="form_busy">Chargement...</div>}
      </form>
    )
  }
}