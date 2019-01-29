const axios = require('axios')
const {
  buildFoodQuery,
  buildFoodQueryResult
} = require('../../../fitBotLambda/intentHandlers/handleQueryFood')

console.log(process.env.NODE_ENV)

const rootUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://d729ac96.ngrok.io'
    : 'https://fitbot-cedrus.herokuapp.com'

function getServingUnit(params) {
  return params.reduce((curr, next) => curr || next, false)
}

function getServingQuantity(params) {
  return params.reduce((curr, next) => curr || next, false)
}

function getUserId(session) {
  return session.split('/')[4].split('-')[0]
}

// nutritionix api call using dialog flow
function getNutritionInfo(name, quantity, unit, agent) {
  return axios
    .post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        query: buildFoodQuery(name, Number(quantity), unit)
      },
      {
        headers: {
          'x-app-id': process.env.NUTRITION_API_ID,
          'x-app-key': process.env.NUTRITION_API_KEY,
          'x-remote-user-id': 0
        }
      }
    )
    .then(res => res.data)
    .then(nutritionInfo => {
      const message = `${buildFoodQueryResult(
        nutritionInfo,
        unit
      )} Would you like to log this item?`
      agent.add(message)
      agent.context.set('queryfood-followup', 1, {
        calories: nutritionInfo.foods[0].nf_calories,
        weightInGrams: nutritionInfo.foods[0].serving_weight_grams,
        quantity,
        unit
      })
    })
    .catch(err => {
      const message = `${err.response.data.message} Please try again.`
      agent.add(message)
    })
}

function saveFoodLog(foodLog, agent) {
  return axios
    .post(`${rootUrl}/api/foodLogs`, {
      foodLog,
      id: getUserId(agent.session)
    })
    .then(res => res.data)
    .then(log => {
      const event = {
        name: 'GetStatus',
        languageCode: 'en-US',
        parameters: {
          foodName: log.name
        }
      }

      agent.add(`Your ${log.name} has been logged.`)

      agent.setFollowupEvent(event)
    })
    .catch(err => {
      agent.add(`Something went wrong. ${err}`)
    })
}

function getFoodLogs(date, agent) {
  const {foodName} = agent.parameters
  let message = ''

  if (foodName) message += `Your ${foodName} has been logged. `
  return axios
    .get(
      `${rootUrl}/api/foodLogs?dateStr=${date}&userId=${getUserId(
        agent.session
      )}`
    )
    .then(res => res.data)
    .then(foodLogs => {
      let calories = 0
      foodLogs.forEach(food => {
        calories += food.calories
      })

      agent.add(
        message + `You had ${Math.round(calories * 100) / 100} calories today.`
      )
    })
    .catch(err => {
      agent.add(`Error in getting status. ${err}`)
    })
}

module.exports = {
  getServingQuantity,
  getServingUnit,
  getNutritionInfo,
  saveFoodLog,
  getFoodLogs
}
