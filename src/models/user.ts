import Model from 'models/base/model'

export default interface User extends Model {
  created?: Date
  updated?: Date
  email?: string
  optin?: boolean
  optinPartner?: boolean
  address?: string
  country?: string
  zip?: string
  tel?: string
  civility?: string
  firstName?: string
  lastName?: string
  companyIds?: string[]
}