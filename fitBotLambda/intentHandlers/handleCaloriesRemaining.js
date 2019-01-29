const axios = require('axios')

const {close} = require('../responseHandlers')

const rootUrl = 'https://d729ac96.ngrok.io'
// const rootUrl = 'https://fitbot-cedrus.herokuapp.com'

function handleCaloriesRemaining(request) {
  const {sessionAttributes} = request
  console.log(sessionAttributes)
  let date = new Date()
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return axios
    .get(
      `${rootUrl}/api/foodLogs?dateStr=${date}&userId=${
        sessionAttributes.userId
      }`
    )
    .then(res => res.data)
    .then(foodLogs => {
      let calories = 0
      foodLogs.forEach(food => {
        calories += food.calories
      })
      return close(
        sessionAttributes,
        'Fulfilled',
        `You had ${Math.round(calories * 100) / 100} calories today.`
      )
    })
    .catch(err => {
      close(sessionAttributes, 'Failed', `Error in getting status. ${err}`)
    })
}

module.exports = {handleCaloriesRemaining}
