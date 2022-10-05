import request from 'supertest'
import app from '../config/app'

describe('SingUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Felipe',
        email: 'felipe@mail.com',
        password: '12321',
        passwordConfirmation: '12321'
      })
      .expect(200)
  })
})
