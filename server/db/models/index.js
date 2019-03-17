const User = require('./user')
const FoodLog = require('./foodLog')
const ExerciseLog = require('./exerciseLog')
const Workout = require('./workout')

FoodLog.belongsTo(User)
ExerciseLog.belongsTo(User)
ExerciseLog.belongsTo(Workout)

User.hasMany(FoodLog)
User.hasMany(ExerciseLog)
Workout.hasMany(ExerciseLog)

module.exports = {
  User,
  FoodLog,
  ExerciseLog
}
