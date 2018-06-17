import Model from 'models/base/model'

export default interface Prevision extends Model {
  year?: number
  type?: string
  desc?: string
  months?: number[]
}