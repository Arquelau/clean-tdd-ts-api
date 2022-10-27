export const surveyPath = {
  get: {
    tags: ['Enquete'],
    summary: 'API para listar todas as enquetes',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
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
