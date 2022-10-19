export class EmailInUseError extends Error {
  constructor () {
    super('Tried to create an account with an email that already is in use')
    this.name = 'EmailInUseError'
  }
}
