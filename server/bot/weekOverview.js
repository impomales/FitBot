const {Op} = require('sequelize')
const {ExerciseLog, FoodLog} = require('../db/models')

module.exports = async function weekOverview(user) {
  const days = []
  const foodCaloriesPerDay = []
  const exerciseCaloriesPerDay = []

  for (let i = 6; i >= 0; i--) {
    let begin = new Date(),
      end
    begin = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate())
    begin.setDate(begin.getDate() - i)
    end = new Date()
    end.setDate(begin.getDate() + 1)
    days.push({
      [Op.gte]: begin,
      [Op.lt]: end
    })
  }

  for (let i = 0; i < days.length; i++) {
    try {
      const foodLogs = await FoodLog.findAll({
        where: {createdAt: days[i], userId: user.id}
      })

      const exerciseLogs = await ExerciseLog.findAll({
        where: {createdAt: days[i], userId: user.id}
      })

      let foodCalories = 0,
        exerciseCalories = 0
      foodLogs.forEach(food => {
        foodCalories += food.calories
      })
      exerciseLogs.forEach(exercise => {
        exerciseCalories += exercise.calories
      })

      foodCaloriesPerDay.push(foodCalories)
      exerciseCaloriesPerDay.push(exerciseCalories)
    } catch (err) {
      return `Error in getting progress. ${err}`
    }
  }

  return {
    message: 'Below are your net calories in the last seven days.',
    chartData: {days, foodCaloriesPerDay, exerciseCaloriesPerDay}
  }
}
