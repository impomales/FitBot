const axios = require('axios')
const {close} = require('../responseHandlers')

// helper functions
function buildFoodQuery(food, quantity, unit) {
  if (unit) return `${quantity} ${unit}s of ${food}`
  else return `${quantity} ${food}s`
}

module.exports.handleQueryFood = function(request) {
  const slots = request.currentIntent.slots
  const source = request.invocationSource
  const sessionAttributes = request.sessionAttributes

  if (source === 'FulfillmentCodeHook') {
    return axios
      .post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
          query: buildFoodQuery(
            slots.FoodQueryName,
            slots.FoodQueryQuantity,
            slots.FoodQueryUnit
          )
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
        const {food_name, nf_calories} = nutritionInfo.foods[0]
        return close(
          sessionAttributes,
          'Fulfilled',
          `${food_name} has ${Math.round(nf_calories)} calories.`
        )
      })
      .catch(err => {
        return close(sessionAttributes, 'Failed', err.message)
      })
  }
}
