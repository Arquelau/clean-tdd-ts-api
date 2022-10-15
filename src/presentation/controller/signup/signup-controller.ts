import { HttpResponse, HttpRequest, Controller, AddAccount, Validation } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helper/http/http-helper'
import { AccountAlreadyExistsError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const emailExists = await this.addAccount.exists({
        name,
        email,
        password
      })
      if (emailExists) {
        return badRequest(new AccountAlreadyExistsError())
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
