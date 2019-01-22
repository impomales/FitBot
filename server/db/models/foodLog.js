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
    type: Sequelize.INTEGER,
    allowNull: false
  },
  weightInGrams: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  calories: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  mealTime: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = FoodLog
