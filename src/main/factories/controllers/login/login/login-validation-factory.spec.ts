import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { mockEmailValidator } from '@/validation/test'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('SignupValidationFactory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
