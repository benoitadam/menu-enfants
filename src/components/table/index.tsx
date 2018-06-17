import { h, Component, options } from 'preact'
import { cls, toNumber } from 'services/helper';
import './style.css'
import { IColumn } from './index';

export type CellRender<T> = (col: IColumn<any>, colIndex: number) => (row: T) => JSX.Element

export interface IColumn<T> {
  key: string
  class?: string
  title?: string
  width?: string
  render?: 'input'|'select'|'number'|CellRender<T>
  options?: [string, JSX.Element|string][]
  get?: (row: T) => any
  set?: (row: T, value: any) => any
}

export interface TableProps {
  class?
  className?
  children?
  data: any[]
  rowKey: (row: any) => any
  columns: IColumn<any>[]
  onSelect?: (row: any) => any
  onChange?: (rowIndex: number, row: any, col: IColumn<any>, value: any) => any
}
interface State {
}
export default class Table extends Component<TableProps, State> {
  
  onRowClick = (e) => {
    console.log('onRowClick', e)
    if (this.props.onSelect) {
      e.preventDefault()
      let tr: HTMLElement = e.target
      while(tr.tagName !== 'TR') tr = tr.parentNode as HTMLElement
      console.log('tr', tr)
      const i = tr.dataset.i // tr.getAttribute('data-i')
      const row = this.props.data[i]
      this.props.onSelect(row)
    }
  }
  
  cellChange(e: any, value: any, col: IColumn<any>) {
    e.preventDefault()
    console.log('cellChange', e, value, col)
    const rowIndex: number = e.target.getAttribute('data-i')
    const row = this.props.data[rowIndex]
    console.log('row', row)
    col.set(row, value)
    console.log('row', row)
    if (this.props.onChange) {
      this.props.onChange(rowIndex, row, col, value)
    }
  }

  _readonly(col: IColumn<any>) {
    console.log('_readonly', col)
    const { key, class: clss, get } = col
    return (row, rowIndex) => (
      <td key={key} class={clss}>
        {get(row)}
      </td>
    )
  }

  _input(col: IColumn<any>) {
    console.log('_input', col)
    const { key, class: clss, get } = col
    const onChange = e => this.cellChange(e, e.target.value, col)
    return (row, rowIndex) => (
      <td key={key} class={clss}>
        <input data-i={rowIndex} value={get(row)} onChange={onChange} />
      </td>
    )
  }

  _number(col: IColumn<any>) {
    console.log('_number', col)
    const { key, class: clss, get } = col
    const onChange = e => this.cellChange(e, toNumber(e.target.value), col)
    return (row, rowIndex) => (
      <td key={key} class={clss}>
        <input data-i={rowIndex} value={get(row)} onChange={onChange} />
      </td>
    )
  }

  _select(col: IColumn<any>) {
    console.log('_select', col)
    const { key, class: clss, get, options } = col
    const onChange = e => this.cellChange(e, e.target.value, col)
    return (row, rowIndex) => {
      const value = get(row)
      return (
        <td key={key} class={clss}>
          <select data-i={rowIndex} onChange={onChange}>
            {options.map(
              ([v, c]) =>
                <option key={v} value={v} selected={v === value}>{c}</option>
            )}
          </select>
        </td>
      )
    }

    // const { name, class: clss, get } = col
    // const onChange = e => this.cellChange(e, e.target.value, col)
    // return (row, rowIndex) => (
    //   <td key={name} class={clss}>
    //     <input data-i={rowIndex} value={get(row)} onChange={onChange} />
    //   </td>
    // )


    // fp.onChange = (e) => this.change(e, e.target.value)
    // const onInputChange = (e) => this.change(e, ':' + e.target.value)
    // const entries = Object.keys(options).map(k => [k, options[k]])
    // entries.unshift([null, null])
    // this.inputRender = value => {
    //   const otherSelected = other && value && value[0] === ':'

    //   if (otherSelected) {

    //     value = value.substr(1)

    //     return [
    //       <select class={cls(fp, 'select-other')} {...fp}>
    //         {entries.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    //         <option value=':' selected>Autre</option>
    //       </select>,
    //       <input class="input-other" value={value} onChange={onInputChange} />
    //     ]

    //   } else {

    //     return (
    //       <select {...fp}>
    //         {entries.map(([k, v]) => <option key={k} value={k} selected={k === value}>{v}</option>)}
    //         {other && <option value=':'>Autre</option>}
    //       </select>
    //     )

    //   }
    // }
  }

  render({ onSelect, rowKey, data, columns, children, ...rest }: TableProps, {}: State) {
    
    if(!columns) {
      return <div />
    }

    const cells = columns.map((col, colIndex) => {
      try {
        const { render, key } = col
        if (!col.get) col.get = (row) => row[key]
        if (!col.set) col.set = (row, value) => row[key] = value
        return !render ? this._readonly(col) :
          typeof render === 'string' ? this['_' + render](col, colIndex) :
          render(col, colIndex)
      } catch (e) {
        console.error('render', e, col)
      }
    })

    return (
      <table class={cls(rest, 'table', onSelect&&'table-selectable')}>
        <thead>
          <tr class="table_header">
            {columns.map(({ title, width }) =>
              <th style={{ width }}>
                {title}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const key = rowKey(row)
            return (
              <tr key={key} data-key={key} data-i={i} role="row" class={i%2?'even':'odd'} onClick={this.onRowClick}>
                {cells.map(cell => cell(row, i))}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}