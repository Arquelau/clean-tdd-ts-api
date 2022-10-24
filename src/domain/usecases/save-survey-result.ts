import { SurveyResultModel } from '../models/survey-result'

/*
import { SurveyAnswersModel } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}
*/
export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
