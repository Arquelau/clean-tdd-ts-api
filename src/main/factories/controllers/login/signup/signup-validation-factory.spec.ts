import { ValidationComposite, EmailValidation, RequiredFieldValidation, CompareFieldsValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { mockEmailValidator } from '@/validation/test'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('SignupValidationFactory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
