const Sequelize = require('sequelize')
const db = require('../db')

const {ExerciseLog} = require('./exerciseLog')

const Workout = db.define('workout', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

Workout.saveWorkout = async function(user, name, exercises) {
  try {
    const newWorkout = await Workout.create({name})

    for (let i = 0; i < exercises.length; i++) {
      const params = {
        name: exercises[i].ExerciseName,
        unit: exercises[i].ExerciseUnit,
        quantity: exercises[i].ExerciseQuantity,
        calories: exercises[i].calories
      }

      const logItem = await ExerciseLog.create(params)
      // sets a reference to workout but not user.
      // only saves a workout, but doesn't log it to a user.
      await logItem.setWorkout(newWorkout)
    }

    newWorkout.setUser(user)

    return newWorkout
  } catch (err) {
    return `Error in saving workout ${err}`
  }
}

module.exports = Workout
