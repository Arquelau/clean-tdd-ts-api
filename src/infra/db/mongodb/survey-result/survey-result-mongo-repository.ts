
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: MongoHelper.stringToObjectId(data.surveyId),
      accountId: MongoHelper.stringToObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
    const surveyResult = this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  private async loadBySurveyId (id: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyId = MongoHelper.stringToObjectId(id)
    const query = new QueryBuilder()
      .match({
        surveyId
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          allAnswersOptions: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $ne: ['$$item.answer', '$data.answer']
              }
            }
          },
          total: '$count',
          answers: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({
        path: '$_id.answers'
      })
      .addFields({
        '_id.answers.count': '$count',
        '_id.answers.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      })
      .unwind({
        path: '$_id.allAnswersOptions',
        preserveNullAndEmptyArrays: true
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        allAnswersOptions: {
          $addToSet: '$_id.allAnswersOptions'
        },
        answers: {
          $addToSet: '$_id.answers'
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers',
          diffAnswersOptions: {
            $map: {
              input: { $setDifference: ['$allAnswersOptions.answer', '$answers.answer'] },
              as: 'e',
              in: { answer: '$$e' }
            }
          }
        }
      })
      .addFields({
        '_id.diffAnswersOptions.count': {
          $cond: [{
            $eq: ['$_id.diffAnswersOptions', null]
          }, '$$REMOVE', 0]
        },
        '_id.diffAnswersOptions.percent': {
          $cond: [{
            $eq: ['$_id.diffAnswersOptions', null]
          }, '$$REMOVE', 0]
        }
      })
      .unwind({
        path: '$_id.diffAnswersOptions',
        preserveNullAndEmptyArrays: true
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$_id.answers'
        },
        diffAnswersOptions: {
          $addToSet: '$_id.diffAnswersOptions'
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: {
            $cond: [{
              $eq: ['$_id.diffAnswersOptions', null]
            }, '$_id.answers', { $concatArrays: ['$_id.answers', '$diffAnswersOptions'] }]
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        answers: '$_id.answers',
        date: '$_id.date'
      })
      .build()

    const surveyResult = (await surveyResultCollection.aggregate(query).toArray())[0] as SurveyResultModel
    return surveyResult
  }
}
