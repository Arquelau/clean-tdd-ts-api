import { SurveyModel } from '@/domain/models/survey'

/*
import { SurveyAnswersModel } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}
*/
export type AddSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
