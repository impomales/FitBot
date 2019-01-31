const axios = require('axios')

const {close} = require('../responseHandlers')

const rootUrl = 'https://153818af.ngrok.io'
// const rootUrl = 'https://fitbot-cedrus.herokuapp.com'

function buildCaloriesStatus(dailyGoals, calories) {
  const net = Math.round((dailyGoals - calories) * 100) / 100

  return net > 0
    ? ` You still are ${net} calories away from your daily goal!`
    : ` Uh oh! You went over your daily goals by ${net} calories today! You might want to go to the gym.`
}

function handleCaloriesRemaining(request) {
  const {sessionAttributes} = request
  const {userId, foodName} = sessionAttributes

  let message = ''
  if (foodName) message += `Your ${foodName} has been logged. `

  // current current date. set sec, min, hr to zeroes.
  let date = new Date()
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return axios
    .get(`${rootUrl}/api/users/${userId}`)
    .then(res => res.data)
    .then(user => {
      return axios
        .get(`${rootUrl}/api/foodLogs?dateStr=${date}&userId=${user.id}`)
        .then(res => res.data)
        .then(foodLogs => {
          let calories = 0
          foodLogs.forEach(food => {
            calories += food.calories
          })

          calories = Math.round(calories * 100) / 100
          return close(
            sessionAttributes,
            'Fulfilled',
            message +
              `You had ${calories} calories today.` +
              buildCaloriesStatus(user.dailyGoals, calories)
          )
        })
        .catch(err => {
          return close(
            sessionAttributes,
            'Failed',
            `Error in getting status. ${err}`
          )
        })
    })
    .catch(err => {
      return close(sessionAttributes, 'Failed', `Error in getting user. ${err}`)
    })
}

module.exports = {handleCaloriesRemaining, buildCaloriesStatus}
