//import { Subscription } from 'rxjs/Subscription'

export function persistenceState<T>(component: any, defaultValue?: T): T {
  try {
    console.log('persistenceState', component)
  
    component.__setState = component.setState
    
    const key = (component.constructor.name) + '.state'
  
    const save = () => {
      const stateJson = JSON.stringify(component.state)
      console.log('setItem', key, stateJson)
      localStorage.setItem(key, stateJson)
    }
  
    let saveTimer;
    
    component.setState = (value) => {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(save, 500)
      component.__setState(value)
    }
    
    const stateJson = localStorage.getItem(key)
    const stateValue = JSON.parse(stateJson) as T

    if (stateValue) {
      if (defaultValue) {
        // If the cache is obsolete, update property type
        for (const key of Object.keys(defaultValue)) {
          const value = defaultValue[key]
          if (value !== undefined && value !== null && typeof value !== typeof stateValue[key]) {
            stateValue[key] = value
          }
        }
      }
      return stateValue
    }

    return defaultValue || {} as T
  }
  catch(e) {
    console.error('persistenceState', e)
    return defaultValue
  }
}

export function cls(rest: {className?, class?}, ...names: string[]) {
  const { class: c, className } = rest
  if (c) {
    delete rest.class
    names.push(c)
  }
  if (className) {
    delete rest.className
    names.push(className)
  }
  return names.filter(p => !!p).join(' ')
}

export function storage<T>(name: string, value?: T): T {
  console.log('storage', name, value)
  try {
    if (value !== undefined) {
      localStorage.setItem(name, JSON.stringify(value))
      return value
    }
    const item = localStorage.getItem(name)
    return item === null ? null : JSON.parse(item)
  } catch(e) {
    console.error('storage', name, value, e)
    return null
  }
}

export function getVal<T>(dico: { [key: string]: T }, key: any, defaultValue = null) {
  if (typeof dico !== 'object') {
    return defaultValue
  }
  const item = dico[key]
  return item === undefined ? defaultValue : item
}

export function toDico<T>(
  array: T[],
  key: (item: T, index: number) => string
): { [key: string]: T } {
  return toDicoMap(array, key, undefined)
}

export function toDicoMap<In, Out=any|In>(
  array: In[],
  key: (item: In, index: number) => string,
  map: (item: In, index: number) => Out
): { [key: string]: Out } {
  const result = {}
  if (map === undefined) {
    for (let i=0, l=array.length; i<l; i++) {
      const item = array[i]
      result[key(item, i)] = item
    }
  } else {
    for (let i=0, l=array.length; i<l; i++) {
      const item = array[i]
      result[key(item, i)] = map(item, i)
    }
  }
  return result
}

export function toString(value: any, defaultValue: any = null): string {
  return typeof value === 'string' ? value :
    value === null || value === undefined ? defaultValue :
    value.toString()
}

export function toDate(value: any, defaultValue: any = null): Date {
  if (typeof value === 'string') {
    return new Date(value)
  }
  if (value instanceof Date) {
    return value
  }
  return defaultValue
}

export function toNumber(value: any, defaultValue: any = null): number {
  let num;
  if (typeof value === 'string') {
    value = value.replace(/[^0-9,.]/g, '').replace(/,/g, '.')
  }
  return value && !Number.isNaN(num = parseFloat(value)) ? num : defaultValue
}

export function toBoolean(value: any, defaultValue: any = null): boolean {
  return value === undefined || value === null  ? defaultValue : !!value
}

export function toArray<T>(array: T[], defaultValue: T = null, length: number = undefined): T[] {
  const result = []
  if (array instanceof Array) {
    if(length === undefined) {
      length = array.length
    }
    for (let i=0; i<length; i++) {
      const v = array[i]
      result.push(v === undefined ? defaultValue : v)
    }
  } else {
    for (let i=0; i<length; i++) {
      result.push(defaultValue)
    }
  }
  return result
}

export class Subscriptions {
  public subs: (()=>void)[] = []

  // (Subscription | (() => void))[]
  public add(...subscriptions: any[]) {
    for (const sub of subscriptions) {
      if(typeof sub === 'function') {
        this.subs.push(sub)
      } else if(typeof sub === 'object' && typeof sub.unsubscribe === 'function') {
        this.subs.push(() => sub.unsubscribe())
      }
    }
  }
  
  public unsubscribe() {
    for (const sub of this.subs) {
      try {
        sub()
      } catch(err) {
        console.error('Subscriptions.unsubscribe', err)
      }
    }
    this.subs = []
  }
}

export function subscriptions(ref: any): Subscriptions {
  return (ref as any)._Subscriptions_ || ((ref as any)._Subscriptions_ = new Subscriptions())
}