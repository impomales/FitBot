const axios = require('axios')
const {close} = require('../responseHandlers')

const rootUrl = 'https://d729ac96.ngrok.io'
// const rootUrl = 'https://fitbot-cedrus.herokuapp.com'

function handleLogFood(request) {
  const {sessionAttributes, invocationSource, currentIntent, c} = request
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
        return close(
          sessionAttributes,
          'Fulfilled',
          `Your ${log.name} has been logged.`
        )
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
