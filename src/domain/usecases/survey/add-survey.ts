import { SurveyModel } from '@/domain/models/survey'

/*
import { SurveyAnswersModel } from '@/domain/models/survey'

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}
*/
export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
