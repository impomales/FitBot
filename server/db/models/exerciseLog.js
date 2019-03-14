const Sequelize = require('sequelize')
const db = require('../db')

const ExerciseLog = db.define('exerciseLog', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  unit: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.STRING,
    allowNull: false
  },
  calories: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

ExerciseLog.saveExerciseLog = async function(user, exerciseLog) {
  try {
    const newLog = await ExerciseLog.create(exerciseLog)
    await newLog.setUser(user)
    return newLog
  } catch (err) {
    return `Error in saving food log ${err}`
  }
}

module.exports = ExerciseLog
