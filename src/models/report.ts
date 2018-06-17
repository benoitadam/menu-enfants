import Model from 'models/base/model'

export default interface Report extends Model {
  name?: string
  companyId?: string
  userId?: string
}