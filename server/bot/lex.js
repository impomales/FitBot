const aws = require('aws-sdk')
const randomstring = require('randomstring')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')

/**
 * initiates the lex service
 * @function
 * @param {*} user currently logged in user
 * @returns {string} session id
 */
function initiateLex(user) {
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
        // can enter user data here, calorie goals, currentCalories, weight, etc.
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

module.exports = {initiateLex, messageLex, handleResponseLex}
