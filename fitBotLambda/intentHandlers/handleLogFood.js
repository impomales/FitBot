const axios = require('axios')
const {
  close,
  delegate,
  elicitSlot,
  confirmIntent
} = require('../responseHandlers')
const {buildFoodQuery, buildFoodQueryResult} = require('./handleQueryFood')
const {handleCaloriesRemaining} = require('./handleCaloriesRemaining')

const rootUrl = 'https://153818af.ngrok.io'
// const rootUrl = 'https://fitbot-cedrus.herokuapp.com'

function handleDialogCodeHook(request) {
  const {sessionAttributes, inputTranscript, currentIntent} = request
  const slots = currentIntent.slots
  let {FoodLogName, FoodLogQuantity, FoodLogUnit, Calories} = slots
  // if user types 'a {food} or an {food}, set quantity to 1.
  if (
    !FoodLogQuantity &&
    FoodLogName &&
    (inputTranscript.includes(' a ') || inputTranscript.includes(' an '))
  ) {
    FoodLogQuantity = '1'
  }

  // if user only enters a food name
  if (FoodLogName && !FoodLogUnit && !FoodLogQuantity) {
    return elicitSlot(
      sessionAttributes,
      'LogFood',
      slots,
      'FoodLogUnit',
      'Please enter a unit of measure.'
    )
  }

  if (!Calories) {
    return axios
      .post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        {
          query: buildFoodQuery(
            FoodLogName,
            Number(FoodLogQuantity),
            FoodLogUnit
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
          Object.assign(slots, {
            Calories: nutritionInfo.foods[0].nf_calories,
            WeightInGrams: nutritionInfo.foods[0].serving_weight_grams
          }),
          `${buildFoodQueryResult(
            nutritionInfo,
            FoodLogUnit
          )} Would you like to log this item?`
        )
      })
  }

  return delegate(sessionAttributes, Object.assign(slots, {FoodLogQuantity}))
}

function handleLogFood(request) {
  const {sessionAttributes, invocationSource, currentIntent} = request
  const {slots, confirmationStatus} = currentIntent
  const {
    FoodLogName,
    FoodLogQuantity,
    FoodLogUnit,
    MealTime,
    Calories,
    WeightInGrams
  } = slots
  const {userId} = sessionAttributes

  if (confirmationStatus === 'Denied') {
    return close(
      sessionAttributes,
      'Fulfilled',
      `OK. I won't log ${FoodLogName}.`
    )
  }

  if (invocationSource === 'DialogCodeHook') {
    return handleDialogCodeHook(request)
  }

  if (invocationSource === 'FulfillmentCodeHook') {
    return axios
      .post(`${rootUrl}/api/foodLogs`, {
        foodLog: {
          name: FoodLogName,
          quantity: FoodLogQuantity,
          unit: FoodLogUnit,
          mealTime: MealTime,
          calories: Calories,
          weightInGrams: WeightInGrams
        },
        id: userId
      })
      .then(res => res.data)
      .then(log => {
        sessionAttributes.foodName = log.name
        return handleCaloriesRemaining(request)
      })
      .catch(err => {
        return close(
          sessionAttributes,
          'Failed',
          `Something went wrong. ${err}`
        )
      })
  }
}

module.exports = {handleLogFood}
