const {FoodLog} = require('../db/models')
const {Op} = require('sequelize')

/**
 * Creates a response depending on whether a user is over or under their caloric goal
 * @function
 * @param {Number} dailyGoals number of calories allowed per day for user
 * @param {Number} calories number of user's actual calories
 * @returns {String} conditional response string dependant on net calories
 */
function buildCaloriesStatus(dailyGoals, calories) {
  const net = Math.round((dailyGoals - calories) * 100) / 100

  return net > 0
    ? ` You still are ${net} calories away from your daily goal!`
    : ` Uh oh! You went over your daily goals by ${-1 *
        net} calories today! You might want to go to the gym.`
}

/**
 * Gets user's foodlogs by today's date. Calculates net calories and returns a response message based on the result.
 * @function
 * @param {Object} user current user
 * @param {String} [foodName] food name is included when this function is called immediately after logging an item.
 * @returns {String} resultant response to user
 */
module.exports = async function caloriesRemaining(user, foodName) {
  let message = ''
  if (foodName) message += `Your ${foodName} has been logged. `

  // foodLog.createdAt >= today, foodLog.createdAt < tomorrow
  let today = new Date(),
    tomorrow
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const createdAt = {
    [Op.gte]: today,
    [Op.lt]: tomorrow
  }

  try {
    const foodLogs = await FoodLog.findAll({
      where: {createdAt, userId: user.id}
    })

    let calories = 0
    foodLogs.forEach(food => {
      calories += food.calories
    })

    calories = Math.round(calories * 100) / 100
    return (
      message +
      `You had ${calories} calories today.` +
      buildCaloriesStatus(user.dailyGoals, calories)
    )
  } catch (err) {
    return `Error in getting status. ${err}`
  }
}
