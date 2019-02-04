const randomstring = require('randomstring')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')

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
    } else if (type === 'WATSON') {
      this.initiate = initiateWatson
      this.message = messageWatson
      this.handleResponse = handleWatsonResponse
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

async function handleResponseLex(user, response) {
  const {intentName, slots, sessionAttributes, dialogState, message} = response
  if (
    intentName === 'CaloriesRemaining' &&
    (dialogState === 'ReadyForFulfillment' || dialogState === 'Fulfilled')
  ) {
    const foodName = sessionAttributes.foodName
    return caloriesRemaining(user, foodName)
  } else if (intentName === 'LogFood') {
    if (dialogState === 'Fulfilled') return message
    else if (dialogState === 'ReadyForFulfillment') {
      const foodLog = {
        name: slots.FoodLogName,
        quantity: slots.FoodLogQuantity,
        unit: slots.FoodLogUnit,
        mealTime: slots.MealTime,
        calories: slots.Calories,
        weightInGrams: slots.WeightInGrams
      }
      const newLog = await saveFoodLog(user, foodLog)
      if (newLog.name) return caloriesRemaining(user, newLog.name)
      else return newLog
    }
  }

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
    fulfillmentText,
    outputContexts
  } = response
  if (intent.displayName === 'Status' && allRequiredParamsPresent) {
    const foodName = parameters.fields.foodName.stringValue
    return caloriesRemaining(user, foodName)
  }

  if (
    intent.displayName === 'QueryFood - log-yes' &&
    allRequiredParamsPresent
  ) {
    const foodLog = {}
    const contextFields = outputContexts[0].parameters.fields
    foodLog.name = contextFields.name.stringValue
    foodLog.unit = contextFields.unit.stringValue
    foodLog.quantity = contextFields.quantity.numberValue
    foodLog.weightInGrams = contextFields.weightInGrams.numberValue
    foodLog.calories = contextFields.calories.numberValue
    foodLog.mealTime = parameters.fields.mealTime.stringValue
    const newLog = await saveFoodLog(user, foodLog)
    if (newLog.name) return caloriesRemaining(user, newLog.name)
    else return newLog
  }
  return fulfillmentText
}

// Watson methods
function initiateWatson(callback) {
  const watson = require('watson-developer-cloud')
  this.service = new watson.AssistantV2({
    url: process.env.WATSON_URL,
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.VERSION
  })

  this.service.createSession({assistant_id: process.env.WATSON_ID}, callback)
}

function messageWatson(sessionUserId, text, callback) {
  this.service.message(
    {
      assistant_id: process.env.WATSON_ID,
      session_id: sessionUserId,
      input: {
        message_type: 'text',
        text
      }
    },
    callback
  )
}

function handleWatsonResponse(user, response) {
  // TODO
  return response
}

module.exports = Bot
