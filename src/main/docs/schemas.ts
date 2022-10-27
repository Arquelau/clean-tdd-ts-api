import {
  accountSchema,
  surveyResultSchema,
  loginParamsSchema,
  signUpParamsSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema
}
