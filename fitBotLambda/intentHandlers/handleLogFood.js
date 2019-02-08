const {
  close,
  delegate,
  elicitSlot,
  confirmIntent
} = require('../responseHandlers')
const {
  buildFoodQuery,
  buildFoodQueryResult,
  getNutritionInfo
} = require('./handleQueryFood')

function isIndefinite(name, quantity, transcript) {
  return (
    !quantity &&
    name &&
    (transcript.includes(' a ') || transcript.includes(' an '))
  )
}

function handleDialogCodeHook(request) {
  const {sessionAttributes, inputTranscript, currentIntent} = request
  const slots = currentIntent.slots
  let {FoodLogName, FoodLogQuantity, FoodLogUnit, Calories} = slots
  // if user types 'a {food} or an {food}, set quantity to 1.
  if (isIndefinite(FoodLogName, FoodLogQuantity, inputTranscript)) {
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
    return getNutritionInfo(
      buildFoodQuery(FoodLogName, Number(FoodLogQuantity), FoodLogUnit),
      nutritionInfo => {
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
      },
      err => {
        return close(sessionAttributes, 'Failed', err.response.data.message)
      }
    )
  }

  return delegate(sessionAttributes, Object.assign(slots, {FoodLogQuantity}))
}

function handleLogFood(request) {
  const {sessionAttributes, invocationSource, currentIntent} = request
  const {slots, confirmationStatus} = currentIntent

  // does not log if user denies confirmation
  if (confirmationStatus === 'Denied') {
    return close(
      sessionAttributes,
      'Fulfilled',
      `OK. I won't log ${slots.FoodLogName}.`
    )
  }

  if (invocationSource === 'DialogCodeHook') {
    return handleDialogCodeHook(request)
  }

  // fulfillment is handled in node server.
}

module.exports = {handleLogFood}
