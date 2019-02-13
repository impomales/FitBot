const axios = require('axios')
const pluralize = require('pluralize')
const {
  confirmIntent,
  elicitSlot,
  delegate,
  close
} = require('../responseHandlers')

/**
 * builds a query string that will be sent to external api
 * @function
 * @private
 * @param {String} food name of food item
 * @param {Number} quantity food quantity
 * @param {String} [unit] unit of measure
 * @returns {String} query string
 */
function buildFoodQuery(food, quantity, unit) {
  if (unit) return `${quantity} ${pluralize(unit, quantity)} of ${food}`
  else return `${quantity} ${pluralize(food, quantity)}`
}

/**
 * builds a result string to send back to user
 * @function
 * @private
 * @param {Object} nutritionInfo object received from external api
 * @param {String} unit handles string differently if unit exist
 * @returns {String} result string
 */
function buildFoodQueryResult(nutritionInfo, unit) {
  const {
    serving_qty,
    serving_unit,
    nf_calories,
    food_name
  } = nutritionInfo.foods[0]
  let possessVerb = 'has'

  if (pluralize.isPlural(food_name)) possessVerb = 'have'

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

/**
 * calls external api to get nutrition info
 * @function
 * @param {String} query string created using buildFoodQuery
 * @param {Function} success success handler
 * @param {Function} failure failure handler
 * @returns {Object} nutrition info object
 */
function getNutritionInfo(query, success, failure) {
  return axios
    .post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        query
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
    .then(success)
    .catch(failure)
}

/**
 * handles slot filling and validations
 * @param {Object} request lambda request object
 * @param {Object} sessionAttributes attributes that persist throughout a session
 * @param {Object} currentIntent
 * @param {Ojbect} currentIntent.slots parameters used for fulfilling intent
 * @param {String} inputTranscript user input string
 * @returns {Object} lambda response object
 */
function handleDialogCodeHook(request) {
  const {sessionAttributes, inputTranscript, currentIntent} = request
  const slots = currentIntent.slots
  let {FoodQueryName, FoodQueryQuantity, FoodQueryUnit} = slots
  // if user types 'a {food} or an {food}, set quantity to 1.
  if (
    !FoodQueryQuantity &&
    FoodQueryName &&
    (inputTranscript.includes(' a ') || inputTranscript.includes(' an '))
  ) {
    FoodQueryQuantity = '1'
  }

  // if user only enters a food name
  if (FoodQueryName && !FoodQueryUnit && !FoodQueryQuantity) {
    return elicitSlot(
      sessionAttributes,
      'QueryFood',
      slots,
      'FoodQueryUnit',
      'Please enter a unit of measure.'
    )
  }

  return delegate(
    sessionAttributes,
    Object.assign({}, slots, {FoodQueryQuantity})
  )
}

/**
 * handles fulfillment by asking user to confirm log
 * @function
 * @param {Object} request lambda request object
 * @returns {Object} lambda response object
 */
function handleFulfillmentCodeHook(request) {
  const {sessionAttributes, currentIntent} = request
  const slots = currentIntent.slots
  let {FoodQueryName, FoodQueryQuantity, FoodQueryUnit} = slots
  return getNutritionInfo(
    buildFoodQuery(FoodQueryName, Number(FoodQueryQuantity), FoodQueryUnit),
    nutritionInfo => {
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
    },
    err => {
      console.error(err.response.data.message)
      return close(
        sessionAttributes,
        'Failed',
        `${err.response.data.message}. Please try again.`
      )
    }
  )
}

/**
 * main queryFood intent handler
 * @function
 * @param {Object} request
 * @param {String} request.invocationSource determines whether intent ready for fulfillment or not.
 * @returns {Object} lambda response object
 */
function handleQueryFood(request) {
  if (request.invocationSource === 'DialogCodeHook') {
    return handleDialogCodeHook(request)
  } else {
    return handleFulfillmentCodeHook(request)
  }
}

module.exports = {
  handleQueryFood,
  buildFoodQuery,
  buildFoodQueryResult,
  getNutritionInfo
}
