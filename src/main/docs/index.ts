import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0.0',
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [{
    url: '/api',
    description: 'Servidor Principal'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths,
  schemas,
  components
}
