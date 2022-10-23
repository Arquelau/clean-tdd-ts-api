import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-controller-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
