const {FoodLog} = require('../db/models')

module.exports = async function saveFoodLog(user, foodLog) {
  try {
    console.log('hi')
    const newLog = await FoodLog.create(foodLog)
    console.log(newLog)
    await newLog.setUser(user)
    return newLog
  } catch (err) {
    return `Error in saving food log ${err}`
  }
}
