import { makeAutoObservable } from 'mobx'

class RoleStore {
  role: 'candidate' | 'employer' = 'candidate'

  constructor() {
    makeAutoObservable(this)
  }
}

export default new RoleStore()
