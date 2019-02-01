const {FoodLog} = require('../db/models')

module.exports = async function saveFoodLog(user, foodLog) {
  try {
    const newLog = await FoodLog.create(foodLog)
    await newLog.setUser(user)
    return newLog
  } catch (err) {
    return `Error in saving food log ${err}`
  }
}
