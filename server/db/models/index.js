const User = require('./user')
const FoodLog = require('./foodLog')
const ExerciseLog = require('./exerciseLog')
const Workout = require('./workout')

FoodLog.belongsTo(User)
ExerciseLog.belongsTo(User)
ExerciseLog.belongsTo(Workout)
Workout.belongsTo(User)

User.hasMany(FoodLog)
User.hasMany(ExerciseLog)
User.hasMany(Workout)
Workout.hasMany(ExerciseLog)

module.exports = {
  User,
  FoodLog,
  ExerciseLog
}
