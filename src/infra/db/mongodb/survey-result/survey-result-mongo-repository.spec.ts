import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeInsertAccount = async (): Promise<any> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  })
  return res.insertedId
}

const makeInsertSurvey = async (): Promise<any> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })
  return res.insertedId
}

type Ids = {
  surveyId: string
  accountId: string
}

const makeFakeSurveyResultData = async (ids: Ids, answer: string): Promise<SaveSurveyResultModel> => {
  return {
    surveyId: ids.surveyId,
    accountId: ids.accountId,
    answer,
    date: new Date()
  }
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL || ''
    await MongoHelper.connect(mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  describe('save()', () => {
    test('Should save survey result if its new', async () => {
      const surveyId = await makeInsertSurvey()
      const accountId = await makeInsertAccount()

      const sut = makeSut()
      const surveyResultData = await makeFakeSurveyResultData({
        surveyId: surveyId.toString(),
        accountId: accountId.toString()
      }, 'any_answer')
      const surveyResult = await sut.save(surveyResultData)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('any_answer')
    })

    test('Should update survey result if its not new', async () => {
      const surveyId = await makeInsertSurvey()
      const accountId = await makeInsertAccount()

      const res = await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })

      const sut = makeSut()
      const surveyResultData = await makeFakeSurveyResultData({
        surveyId: surveyId.toString(),
        accountId: accountId.toString()
      }, 'other_answer')
      const surveyResult = await sut.save(surveyResultData)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.insertedId)
      expect(surveyResult.answer).toBe('other_answer')
    })
  })
})
