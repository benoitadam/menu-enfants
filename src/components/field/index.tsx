import { h, Component } from 'preact'
import Form from 'components/form'
import { subscriptions, toString, toNumber, toDate, toBoolean, cls } from 'services/helper'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment/locale/fr'
import 'react-datepicker/dist/react-datepicker.css'
import './style.css'

export type FieldRule  = (v:any) => string|undefined

export interface IFieldContext {
  values$?: BehaviorSubject<any>
  errors$?: BehaviorSubject<any>
  setRules?: (name: string, rules: FieldRule[]) => void
  setValue?: (name: string, converter: (value: any) => any) => void
}

export interface FieldProps {
  class?: string
  className?: string
  children?: any
  name?: string
  type?: 'input'|'password'|'number'|'day'|'select'|'checkbox'|'email'|'tel'
  label?: string
  addonAfter?: string
  required?: string|boolean
  placeholder?: string
  options?: { [value: string]: string }
  len?: number
  autoComplete?: string
  prefix?: any
  inline?: boolean
  other?: boolean
}
export interface FieldState {
  value: any,
  error: string
}
export default class Field extends Component<FieldProps, FieldState> {

  context: { fields: IFieldContext }
  inputRender: (value: any) => JSX.Element|JSX.Element[]
  converter: (value: any) => any = toString
  state = { value: undefined, error: undefined }

  constructor(props) {
    super(props)

    const { name, label, type, required, len, ...rest } = this.props

    //let func = this['_' + type] || this['_undefined']
    this['_' + type](rest)

    // const funcName = type === undefined ? '_empty' : '_' + type
    // this[funcName](rest)
  }

  ctx(): IFieldContext { return this.context.fields }

  updateRules() {
    const { name, type, required, len } = this.props
    // console.log('updateRules', name, required)

    const rules: FieldRule[] = []
    
    if (required) {
      rules.push(value => value ? undefined : 'Le champ est obligatoire')
    }
    
    // if (typeof len === 'number') {
    //   rules.push(value => 
    //     !value ? undefined :
    //     value.length === len ? undefined :
    //     `Le champ doit faire exactement ${len} caractères`)
    // }
    
    const ctx = this.ctx()
    ctx.setRules && ctx.setRules(name, rules)
  }

  componentDidMount() {
    const { values$, errors$ } = this.context.fields
    this.updateRules()
    subscriptions(this).add(
      values$ && values$.subscribe(values => {
        const { name } = this.props
        const value = values ? values[name] : undefined
        if (value !== this.state.value) console.log('values subscribe', name, value)
        this.setState({ value })
      }),
      errors$ && errors$.subscribe(errors => {
        const { name } = this.props
        const error = errors ? errors[name] : undefined
        if (error !== this.state.error) console.log('errors subscribe', name, error)
        this.setState({ error })
      })
    )
  }

  componentWillUnmount() {
    subscriptions(this).unsubscribe()
  }

  change(e, value) {
    if (e && e.preventDefault) e.preventDefault()
    this.setValue(value)
  }

  setValue(value: any) {
    console.log('setValue', this.props.name, value)
    const ctx = this.ctx()
    ctx.setValue && ctx.setValue(this.props.name, this.converter(value))
  }
  
  _undefined(fp) {
    this.inputRender = value => undefined
  }
  
  _input(fp) {
    fp.onChange = (e) => this.change(e, e.target.value)
    this.inputRender = value => <input value={value} {...fp} />
  }

  _password(fp) {
    fp.onChange = (e) => this.change(e, e.target.value)
    this.inputRender = value => <input type="password" value={value} {...fp} />
  }

  _number(fp) {
    this.converter = toNumber
    fp.onChange = (e) => this.change(e, e.target.value)
    this.inputRender = value => <input type="number" value={value} {...fp} />
  }

  _day(fp) {
    this.converter = toDate
    fp.onChange = (day) => {
      console.log('day', day)
      this.change(null, day ? day.toDate() : null)
    }
    this.inputRender = value => <DatePicker className="field_day" selected={moment(value)} {...fp} />
  }

  _select({ options, other, ...fp }) {
    fp.onChange = (e) => this.change(e, e.target.value)
    const onInputChange = (e) => this.change(e, ':' + e.target.value)
    const entries = Object.keys(options).map(k => [k, options[k]])
    entries.unshift([null, null])
    this.inputRender = value => {
      const otherSelected = other && value && value[0] === ':'

      if (otherSelected) {

        value = value.substr(1)

        return [
          <select class={cls(fp, 'select-other')} {...fp}>
            {entries.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            <option value=':' selected>Autre</option>
          </select>,
          <input class="input-other" value={value} onChange={onInputChange} />
        ]

      } else {

        return (
          <select {...fp}>
            {entries.map(([k, v]) => <option key={k} value={k} selected={k === value}>{v}</option>)}
            {other && <option value=':'>Autre</option>}
          </select>
        )

      }
    }
  }

  _checkbox(fp) {
    this.converter = toBoolean
    fp.onChange = (e) => this.change(e, !this.state.value)
    //fp.onChange = (e) => this.change(e, e.target.checked)
    this.inputRender = value => <input type="checkbox" checked={value} {...fp} />
  }

  _email(fp) {
    fp.onChange = (e) => this.change(e, e.target.value)
    this.inputRender = value => <input value={value} {...fp} />
  }

  _tel(fp) {
    fp.onChange = (e) => this.change(e, e.target.value)
    this.inputRender = value => <input value={value} {...fp} />
  }

  render({ name, type, label, inline, required, children, ...rest }: FieldProps, { value, error }: FieldState) {
    return (
      <div class={cls(rest, 'field', 'field-'+type,  error && 'field-error', inline && 'field-inline', required && 'field-required' )}>
        {(!label && inline) ? undefined :
          <div class="field_label">
            <label for={name}>
              {required && <b>* </b>}
              {label ? label + ' :' : ''}
            </label>
          </div>
        }
        <div class="field_content">
          <div class="field_inputs">
            {this.inputRender(value)}
            {children}
          </div>
          {error && <div class="field_message">{error}</div>}
        </div>
      </div>
    )
  }
}