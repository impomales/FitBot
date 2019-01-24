const axios = require('axios')
const {
  buildFoodQuery,
  buildFoodQueryResult
} = require('../../../fitBotLambda/intentHandlers/handleQueryFood')

function getServingUnit(params) {
  return params.reduce((curr, next) => curr || next, false)
}

function getServingQuantity(params) {
  return params.reduce((curr, next) => curr || next, false)
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
        weightInGrams: nutritionInfo.foods[0].serving_weight_grams
      })
    })
    .catch(err => {
      const message = `${err.response.data.message} Please try again.`
      agent.add(message)
    })
}

module.exports = {getServingQuantity, getServingUnit, getNutritionInfo}
