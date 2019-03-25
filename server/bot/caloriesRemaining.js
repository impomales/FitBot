const {FoodLog, ExerciseLog} = require('../db/models')
const {Op} = require('sequelize')

const {
  buildFoodQuery
} = require('../../fitBotLambda/intentHandlers/handleQueryFood')

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
 * @param {Object} [foodLog] food is included when this function is called immediately after logging an item.
 * @returns {String} resultant response to user
 */
module.exports = async function caloriesRemaining(user, foodLog, exerciseLog) {
  let message = ''
  if (foodLog) {
    message += `Your ${buildFoodQuery(
      foodLog.name,
      foodLog.quantity,
      foodLog.unit
    )} has been logged as a ${foodLog.mealTime}. `
  } else if (exerciseLog) {
    message += `Your ${exerciseLog.quantity} ${exerciseLog.unit} of ${
      exerciseLog.name
    } has been logged. `
  }
  // foodLog.createdAt >= today, foodLog.createdAt < tomorrow
  let today = new Date(),
    tomorrow
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  tomorrow = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate()
  )

  const createdAt = {
    [Op.gte]: today,
    [Op.lt]: tomorrow
  }

  try {
    const foodLogs = await FoodLog.findAll({
      where: {createdAt, userId: user.id}
    })

    const exerciseLogs = await ExerciseLog.findAll({
      where: {createdAt, userId: user.id}
    })

    let foodCalories = 0,
      exerciseCalories = 0
    foodLogs.forEach(food => {
      foodCalories += food.calories
    })
    exerciseLogs.forEach(exercise => {
      exerciseCalories += exercise.calories
    })

    const calories = Math.round((foodCalories - exerciseCalories) * 100) / 100
    return (
      message +
      `You have a net ${calories} calories today.` +
      buildCaloriesStatus(user.dailyGoals, calories)
    )
  } catch (err) {
    return `Error in getting status. ${err}`
  }
}
