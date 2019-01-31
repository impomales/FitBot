const randomstring = require('randomstring')
const {FoodLog} = require('../db/models')
const {Op} = require('sequelize')

const {
  buildCaloriesStatus
} = require('../../fitBotLambda/intentHandlers/handleCaloriesRemaining')

class Bot {
  constructor(type) {
    this.type = type
    if (type === 'LEX') {
      this.initiate = initiateLex
      this.message = messageLex
      this.handleResponse = handleResponseLex
    } else if (type === 'DIALOG_FLOW') {
      this.initiate = initiateDialogFlow
      this.message = messageDialogFlow
      this.handleResponse = handleResponseDialogFlow
    }
  }
}

// Lex methods

function initiateLex(user) {
  const aws = require('aws-sdk')

  this.service = new aws.LexRuntime({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  return `${user.id}-${randomstring.generate()}`
}

function messageLex(sessionUserId, text, callback) {
  this.service.postText(
    {
      botAlias: process.env.BOT_ALIAS,
      botName: process.env.BOT_NAME,
      userId: sessionUserId,
      inputText: text,
      sessionAttributes: {
        userId: sessionUserId.split('-')[0]
        // enter user data here, calorie goals, currentCalories, weight, etc.
      }
    },
    callback
  )
}

function handleResponseLex(user, response) {
  const {intentName, slots, dialogState, message} = response
  return message
}

// Dialogflow methods

function initiateDialogFlow(user) {
  const dialogflow = require('dialogflow')
  const sessionId = `${user.id}-${randomstring.generate()}`

  this.service = new dialogflow.SessionsClient()
  return this.service.sessionPath(process.env.PROJECT_ID, sessionId)
}

function messageDialogFlow(sessionUserId, text, callback) {
  this.service
    .detectIntent({
      session: sessionUserId,
      queryInput: {
        text: {
          text,
          languageCode: 'en-US'
        }
      }
    })
    .then(responses => {
      callback(null, responses[0].queryResult)
    })
    .catch(err => callback(err))
}

async function handleResponseDialogFlow(user, response) {
  const {
    intent,
    parameters,
    allRequiredParamsPresent,
    fulfillmentText
  } = response

  if (intent.displayName === 'Status' && allRequiredParamsPresent) {
    const foodName = parameters.fields.foodName.stringValue
    let message = ''
    if (foodName) message += `Your ${foodName} has been logged. `

    let today = new Date(),
      tomorrow
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    const createdAt = {
      [Op.gte]: today,
      [Op.lt]: tomorrow
    }

    try {
      const foodLogs = await FoodLog.findAll({
        where: {createdAt, userId: user.id}
      })

      let calories = 0
      foodLogs.forEach(food => {
        calories += food.calories
      })

      calories = Math.round(calories * 100) / 100
      return (
        message +
        `You had ${calories} calories today.` +
        buildCaloriesStatus(user.dailyGoals, calories)
      )
    } catch (err) {
      return `Error in getting status. ${err}`
    }
  }
  return fulfillmentText
}

module.exports = Bot
