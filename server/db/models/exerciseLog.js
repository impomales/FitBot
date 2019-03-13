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

module.exports = ExerciseLog
