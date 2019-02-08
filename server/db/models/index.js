const User = require('./user')
const FoodLog = require('./foodLog')

FoodLog.belongsTo(User)
User.hasMany(FoodLog)

module.exports = {
  User,
  FoodLog
}
