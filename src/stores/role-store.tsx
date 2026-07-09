import { TRole } from '@/types/entities/user.types'
import { makeAutoObservable } from 'mobx'

class RoleStore {
  role: TRole = 'USER'

  constructor() {
    makeAutoObservable(this)
  }
}

export default new RoleStore()
