
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
          answer: {
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
        path: '$_id.answer'
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          allAnswersOptions: '$_id.allAnswersOptions'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .unwind({
        path: '$_id.allAnswersOptions',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        '_id.allAnswersOptions.count': {
          $cond: [{
            $eq: ['$_id.allAnswersOptions', null]
          }, '$$REMOVE', 0]
        },
        '_id.allAnswersOptions.percent': {
          $cond: [{
            $eq: ['$_id.allAnswersOptions', null]
          }, '$$REMOVE', 0]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers'
        },
        allAnswersOptions: {
          $push: '$_id.allAnswersOptions'
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          answers: {
            $cond: [{
              $eq: ['$allAnswersOptions', null]
            }, '$_id.answers', { $concatArrays: ['$_id.answers', '$allAnswersOptions'] }]
          },
          date: '$_id.date'
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
