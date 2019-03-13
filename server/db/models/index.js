const User = require('./user')
const FoodLog = require('./foodLog')
const ExerciseLog = require('./exerciseLog')

FoodLog.belongsTo(User)
ExerciseLog.belongsTo(User)

User.hasMany(FoodLog)
User.hasMany(ExerciseLog)

module.exports = {
  User,
  FoodLog,
  ExerciseLog
}
