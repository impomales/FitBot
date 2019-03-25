const {Op} = require('sequelize')
const {ExerciseLog, FoodLog} = require('../db/models')

module.exports = async function weekOverview(user) {
  const dateRanges = []
  const foodCaloriesPerDay = []
  const exerciseCaloriesPerDay = []
  const net = []

  for (let i = 6; i >= 0; i--) {
    let begin = new Date(),
      end
    begin = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate())
    begin.setDate(begin.getDate() - i)
    end = new Date()
    end.setDate(begin.getDate() + 1)
    end = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    dateRanges.push({
      [Op.gte]: begin,
      [Op.lt]: end
    })
  }

  for (let i = 0; i < dateRanges.length; i++) {
    try {
      const foodLogs = await FoodLog.findAll({
        where: {createdAt: dateRanges[i], userId: user.id}
      })

      const exerciseLogs = await ExerciseLog.findAll({
        where: {createdAt: dateRanges[i], userId: user.id}
      })

      let foodCalories = 0,
        exerciseCalories = 0
      foodLogs.forEach(food => {
        foodCalories += food.calories
      })
      exerciseLogs.forEach(exercise => {
        exerciseCalories += exercise.calories
      })

      foodCaloriesPerDay.push(Math.round(foodCalories * 100) / 100)
      exerciseCaloriesPerDay.push(Math.round(-1 * exerciseCalories * 100) / 100)

      net.push(Math.round((foodCalories - exerciseCalories) * 100) / 100)
    } catch (err) {
      return `Error in getting progress. ${err}`
    }
  }

  const days = dateRanges.map(range => {
    return range[Op.gte]
  })

  return {
    message: 'Below are your calories in the last seven days.',
    chartData: {
      days,
      foodCaloriesPerDay,
      exerciseCaloriesPerDay,
      net,
      dailyGoal: user.dailyGoals
    }
  }
}
