const Sequelize = require('sequelize')
const db = require('../db')

const Workout = db.define('workout', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
})

module.exports = Workout
