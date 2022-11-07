export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswersModel[]
  date: Date
  didAnswer?: boolean
}

type SurveyAnswersModel = {
  image?: string
  answer: string
}
