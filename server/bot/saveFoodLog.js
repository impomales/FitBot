const {FoodLog} = require('../db/models')

/**
 * saves a food log to the database
 * @function
 * @param {Object}   user user associated with the food log
 * @param {Object} foodLog object with required properties
 * @returns {Object} saved foodLog returned from database
 */
module.exports = async function saveFoodLog(user, foodLog) {
  try {
    const newLog = await FoodLog.create(foodLog)
    await newLog.setUser(user)
    return newLog
  } catch (err) {
    return `Error in saving food log ${err}`
  }
}
