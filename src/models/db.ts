import Repository from 'models/base/repository'
import Company from 'models/company'
import Report from 'models/report'
import User from 'models/user'
import Prevision from 'models/prevision'
import { FirebaseFirestore } from '@firebase/firestore-types';
import { importStore } from 'services/fire';
import Model from 'models/base/model';

class CompanyRepository extends Repository<Company> {
  getByUser(userId: string) {
    return this.items(
      this.where('userId', '==', userId)
    )
  }
}

class PrevisionRepository {
  constructor(private companies: CompanyRepository) {}

  repo(companyId: string) {
    return new Repository<Prevision>(this.companies.coll.doc(companyId).collection('previsions'))
  }
  
  getByCompany(companyId: string) {
    return this.repo(companyId).items()
  }
}

class ReportRepository extends Repository<Report> {
  getByCompany(companyId: string) {
    return this.items(
      this.where('companyId', '==', companyId)
    )
  }

  getByUser(userId: string) {
    return this.items(
      this.where('userId', '==', userId)
    )
  }
}

class UserRepository extends Repository<User> {
}

interface Database {
  companies: CompanyRepository
  previsions: PrevisionRepository
  reports: ReportRepository
  users: UserRepository
}

let _db = null

export const modelId = (p: Model) => p._id

export default async function importDb(): Promise<Database> {
  if (_db !== null) return _db
  
  const store = await importStore()

  if (_db !== null) return _db

  const companies = new CompanyRepository(store.collection('companies') as any)
  const previsions = new PrevisionRepository(companies)
  const reports = new ReportRepository(store.collection('reports') as any)
  const users = new UserRepository(store.collection('users') as any)

  _db = { companies, previsions, reports, users }

  if (typeof window !== "undefined") (window as any)._db = _db

  return _db
}