import { loginPath } from './paths'
import { badRequest, serverError, unauthorized, ok, notFound } from './components'
import { accountSchema, loginParamsSchema, errorSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: [{
    '/login': loginPath
  }],
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    ok,
    badRequest,
    notFound,
    unauthorized,
    serverError
  }
}
