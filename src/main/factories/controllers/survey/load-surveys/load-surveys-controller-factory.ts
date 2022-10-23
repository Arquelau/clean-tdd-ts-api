import { Controller } from '../../../../../presentation/protocols'
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-surveys-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controller/survey/load-surveys/load-surveys-controller'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
