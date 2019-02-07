const dialogflow = require('dialogflow')
const randomstring = require('randomstring')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')

function initiateDialogFlow(user) {
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

module.exports = {
  initiateDialogFlow,
  messageDialogFlow,
  handleResponseDialogFlow
}
