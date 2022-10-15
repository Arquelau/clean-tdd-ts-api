export class AccountAlreadyExistsError extends Error {
  constructor () {
    super('Tried to create an account with an email that already exists')
    this.name = 'AccountAlreadyExistsError'
  }
}
