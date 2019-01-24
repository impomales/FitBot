const Sequelize = require('sequelize')
const db = require('../db')

const FoodLog = db.define('foodLog', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  unit: {
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  weightInGrams: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  calories: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  mealTime: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = FoodLog
