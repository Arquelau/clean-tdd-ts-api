export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}

type SurveyAnswersModel = {
  image?: string
  answer: string
}
