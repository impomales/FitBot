const watson = require('watson-developer-cloud')
const caloriesRemaining = require('./caloriesRemaining')
const saveFoodLog = require('./saveFoodLog')
const {queryFood} = require('../../fitbotWatsonCall')

/**
 * initiates the watson service
 * @function
 * @param {Function} callback sends session id back to user
 */
function initiateWatson(callback) {
  this.service = new watson.AssistantV2({
    url: process.env.WATSON_URL,
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.VERSION
  })

  this.service.createSession({assistant_id: process.env.WATSON_ID}, callback)
}

/**
 * sends user input to Watson
 * @function
 * @param {String}      sessionUserId id used to reference current session with user
 * @param {String}      text input text user is sendng
 * @param {Function}    callback function that handles error, or sends response back to user
 */
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
      // data that will persist throughout conversation.
      // I store nutritionInfo to use later when user wants to log food item.
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

/**
 * returns actions object, it can be either default of user defined
 * @private
 * @function
 * @param {Object} response
 * @returns {Object[]} an actions array used to trigger a programmatic call
 */
function getActions_(response) {
  return (
    response.output.actions ||
    (response.output.user_defined && response.output.user_defined.actions)
  )
}

/**
 * handles bot response depending on action object
 * @function
 * @param {Object} user currently logged in user
 * @param {String} user.id user id
 * @param {Object} response object received from watson, contains action parameters needed to handle action
 * @returns {String} response message to user
 */
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
      try {
        const newLog = await saveFoodLog(user, foodLog)
        if (newLog.name) return caloriesRemaining(user, newLog.name)
      } catch (err) {
        return err
      }
    } else if (actions[0].name === 'caloriesRemaining') {
      return caloriesRemaining(user)
    }
  }
  return response.output.generic[0].text
}

module.exports = {initiateWatson, messageWatson, handleResponseWatson}
