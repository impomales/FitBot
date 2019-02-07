const watson = require('watson-developer-cloud')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')
const {queryFood} = require('../../fitbotWatsonCall')

function initiateWatson(callback) {
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
        text,
        options: {
          return_context: true
        }
      },
      context: {
        skills: {
          'main skill': {
            user_defined: {
              nutritionInfo: this.nutritionInfo
            }
          }
        }
      }
    },
    callback
  )
}

function getActions_(response) {
  return (
    response.output.actions ||
    (response.output.user_defined && response.output.user_defined.actions)
  )
}

async function handleResponseWatson(user, response) {
  const actions = getActions_(response)

  if (actions) {
    if (actions[0].name === 'queryFood') {
      const {food, unit, quantity, indefiniteArticle} = actions[0].parameters
      try {
        const nutritionInfo = await queryFood(
          food,
          unit,
          quantity,
          indefiniteArticle
        )
        this.nutritionInfo = nutritionInfo.info
        return nutritionInfo.message
      } catch (err) {
        return err
      }
    } else if (actions[0].name === 'saveFoodLog') {
      const {food, mealTime, unit, nutritionInfo} = actions[0].parameters
      const {calories, weightInGrams, quantity} = nutritionInfo

      const foodLog = {
        name: food,
        quantity,
        weightInGrams,
        calories,
        mealTime,
        unit
      }

      const newLog = await saveFoodLog(user, foodLog)
      if (newLog.name) return caloriesRemaining(user, newLog.name)
    } else if (actions[0].name === 'caloriesRemaining') {
      return caloriesRemaining(user)
    }
  }
  return response.output.generic[0].text
}

module.exports = {initiateWatson, messageWatson, handleResponseWatson}
