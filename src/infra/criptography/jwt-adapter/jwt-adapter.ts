import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secreteKey: string

  constructor (secretKey: string) {
    this.secreteKey = secretKey
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secreteKey)
    return new Promise(resolve => resolve(accessToken))
  }
}
