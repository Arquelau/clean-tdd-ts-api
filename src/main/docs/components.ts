import { badRequest, serverError, unauthorized, notFound, forbidden } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  forbidden,
  badRequest,
  notFound,
  unauthorized,
  serverError
}
