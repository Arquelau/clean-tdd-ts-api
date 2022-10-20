export interface SurveyAnswers {
  image: 'any_image'
  answer: 'any_answer'
}

export interface AddSurveyModel {
  question: 'any_question'
  answers: SurveyAnswers[]
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
