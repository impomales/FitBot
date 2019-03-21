const Sequelize = require('sequelize')
const db = require('../db')

const Workout = db.define('workout', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

// logs exercises in workout for a user.
Workout.logWorkout = async function(user, name, exerciseModel) {
  const workout = await Workout.findOne({where: {name, userId: user.id}})

  if (!workout) return
  const exercises = await workout.getExerciseLogs()

  for (let i = 0; i < exercises.length; i++) {
    const log = {
      name: exercises[i].name,
      unit: exercises[i].unit,
      quantity: exercises[i].quantity,
      calories: exercises[i].calories
    }

    const exerciseLog = await exerciseModel.create(log)
    exerciseLog.setUser(user)
    exerciseLog.setWorkout(workout)
  }

  return 'Workout successfully saved.'
}

// saves a workout that can later be logged.
Workout.saveWorkout = async function(user, name, exercises, exerciseModel) {
  const newWorkout = await Workout.create({name})

  for (let i = 0; i < exercises.length; i++) {
    const params = {
      name: exercises[i].ExerciseName,
      unit: exercises[i].ExerciseUnit,
      quantity: exercises[i].ExerciseQuantity,
      calories: exercises[i].Calories
    }

    const logItem = await exerciseModel.create(params)
    // sets a reference to workout but not user.
    // only saves a workout, but doesn't log it to a user.
    await logItem.setWorkout(newWorkout)
  }

  newWorkout.setUser(user)

  return newWorkout
}

module.exports = Workout
