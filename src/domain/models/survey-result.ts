export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswersModel[]
  date: Date
}

type SurveyResultAnswersModel = {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrentAccountAnswer: boolean
}
