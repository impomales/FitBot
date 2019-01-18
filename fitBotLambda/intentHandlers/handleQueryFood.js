const axios = require('axios')
const pluralize = require('pluralize')
const {confirmIntent, delegate} = require('../responseHandlers')

// helper functions
function buildFoodQuery(food, quantity, unit) {
  if (unit) return `${quantity} ${pluralize(unit, quantity)} of ${food}`
  else return `${quantity} ${pluralize(food, quantity)}`
}

function buildFoodQueryResult(nutritionInfo, unit) {
  const {
    serving_qty,
    serving_unit,
    nf_calories,
    food_name
  } = nutritionInfo.foods[0]
  let possessVerb = 'has'

  if (unit) {
    return `${serving_qty} ${pluralize(
      serving_unit,
      serving_qty
    )} of ${food_name} ${possessVerb} ${nf_calories} calories.`
  }

  if (Number(serving_qty) > 1) possessVerb = 'have'
  return `${serving_qty} ${pluralize(
    food_name,
    serving_qty
  )} ${possessVerb} ${nf_calories} calories.`
}

function handleQueryFood(request) {
  const {
    invocationSource,
    sessionAttributes,
    inputTranscript,
    currentIntent
  } = request
  const slots = currentIntent.slots
  let {FoodQueryName, FoodQueryQuantity, FoodQueryUnit} = slots

  if (invocationSource === 'DialogCodeHook') {
    // if user types 'a {food} or an {food}, set quantity to 1.
    if (
      !FoodQueryQuantity &&
      FoodQueryName &&
      (inputTranscript.includes(' a ') || inputTranscript.includes(' an '))
    ) {
      FoodQueryQuantity = '1'
    }
    return delegate(
      sessionAttributes,
      Object.assign({FoodQueryQuantity}, slots)
    )
  }

  if (invocationSource === 'FulfillmentCodeHook') {
    return axios
      .post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
          query: buildFoodQuery(
            FoodQueryName,
            Number(FoodQueryQuantity),
            FoodQueryUnit
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
        return confirmIntent(
          sessionAttributes,
          'LogFood',
          {
            FoodLogName: FoodQueryName,
            FoodLogQuantity: FoodQueryQuantity,
            FoodLogUnit: FoodQueryUnit,
            MealTime: null,
            Calories: nutritionInfo.foods[0].nf_calories,
            WeightInGrams: nutritionInfo.foods[0].serving_weight_grams
          },
          `${buildFoodQueryResult(
            nutritionInfo,
            FoodQueryUnit
          )} Would you like to log this item?`
        )
      })
      .catch(err => {
        return close(sessionAttributes, 'Failed', err.message)
      })
  }
}

module.exports = {handleQueryFood, buildFoodQuery, buildFoodQueryResult}
