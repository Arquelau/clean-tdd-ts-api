export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Api para autenticar usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        $ref: '#/components/ok'
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      404: {
        $ref: '#/components/not-found'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
