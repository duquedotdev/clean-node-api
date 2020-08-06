/* eslint-disable no-unused-vars */
import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { IEmailValidator } from '../protocols/IEmailValidator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}

const makeSut = (): SignUpController => {
  // Stub, Spy, Double, Fake
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Sign Up Controller', () => {
  test('Should return 400 if no nome is provided', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        // name: '_any_name',
        email: '_any_email',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '_any_name',
        // email: '_any_email',
        password: '_any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '_any_name',
        email: '_any_email',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    // SUT = System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '_any_name',
        email: '_any_email',
        password: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    // SUT = System Under Test
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: '_any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirm: '_any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
