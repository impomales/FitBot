const dialogflow = require('dialogflow')
const randomstring = require('randomstring')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')

/**
 * initiates the dialog flow bot
 * @function
 * @param {Object}  user currently logged in user
 * @param {String}  user.id user id
 * @returns {String} session id
 */
function initiateDialogFlow(user) {
  const sessionId = `${user.id}-${randomstring.generate()}`

  this.service = new dialogflow.SessionsClient()
  return this.service.sessionPath(process.env.PROJECT_ID, sessionId)
}

/**
 * sends user input to Dialog Flow
 * @function
 * @param {String}      sessionUserId id used to reference current session with user
 * @param {String}      text input text user is sending
 * @param {Function}    callback function that handles error, or sends response back to user
 */
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

/**
 * handles bot response depending on intent name and if all requeired params are present
 * @function
 * @param {Object}  user currently logged in user
 * @param {Object}  response object received from dialog flow
 * @param {String}  response.fulfillmentText default response sent from dialog flow
 * @param {Boolean} response.allRequiredParamsPresent true if all required params are present for fulfillment
 * @param {Object}  response.intent contains info about current intent
 * @param {String}  respons.intent.displayName name of current intent
 * @param {Object}  response.parameters contains parameters obtained through slot filling
 * @param {Object}  response.outputContexts contains parameters within contexts persisted throughout the conversation
 * @returns {String} response message to user
 */
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
