import Model from 'models/base/model'

export default interface Company extends Model {
  name?: string
  status?: string
  siret?: string
  capital?: number
  creation?: Date
  cloture?: Date
  regime?: string
  address?: string
  city?: string
  cp?: string
  tel?: string
  civilite?: string
  firstName?: string
  lastName?: string
  naissance?: Date
  nationalite?: string
  userId?: string
}
