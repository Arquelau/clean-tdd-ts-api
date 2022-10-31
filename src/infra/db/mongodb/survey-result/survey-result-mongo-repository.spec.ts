import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

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
    }, {
      image: 'other_image',
      answer: 'other_answer'
    }, {
      image: 'another_image',
      answer: 'another_answer'
    }],
    date: new Date()
  })
  return res.insertedId
}

type Ids = {
  surveyId: string
  accountId: string
}

const mockSaveSurveyResultParams = async (ids: Ids, answer: string): Promise<SaveSurveyResultParams> => {
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
      const surveyResultData = await mockSaveSurveyResultParams({
        surveyId: surveyId.toString(),
        accountId: accountId.toString()
      }, 'any_answer')
      await sut.save(surveyResultData)

      const surveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update survey result if its not new', async () => {
      const surveyId = await makeInsertSurvey()
      const accountId = await makeInsertAccount()

      await surveyResultCollection.insertOne({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })

      const sut = makeSut()
      const surveyResultData = await mockSaveSurveyResultParams({
        surveyId: surveyId.toString(),
        accountId: accountId.toString()
      }, 'other_answer')
      await sut.save(surveyResultData)

      const surveyResult = await surveyResultCollection.find({
        surveyId,
        accountId
      }).toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should return a SurveyResultModel if user answer the survey', async () => {
      const surveyId = await makeInsertSurvey()
      const accountId = await makeInsertAccount()

      await surveyResultCollection.insertMany([{
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'other_answer',
        date: new Date()
      }, {
        surveyId,
        accountId,
        answer: 'other_answer',
        date: new Date()
      }])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString(), accountId.toString())

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyId.toString())
      expect(surveyResult.question).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })

    test('Should return null if there is no user answer', async () => {
      const surveyId = await makeInsertSurvey()
      const accountId = await makeInsertAccount()

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(surveyId.toString(), accountId.toString())

      expect(surveyResult).toBeNull()
    })
  })
})
