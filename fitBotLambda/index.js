const {
  QueryFood,
  QueryExercise,
  LogFood,
  CreateWorkout
} = require('./intentTypes')

const {
  handleQueryFood,
  handleLogFood,
  handleQueryExercise,
  handleCreateWorkout
} = require('./intentHandlers')

function dispatch(request) {
  const intentName = request.currentIntent.name

  switch (intentName) {
    case QueryFood:
      return handleQueryFood(request)
    case QueryExercise:
      return handleQueryExercise(request)
    case LogFood:
      return handleLogFood(request)
    case CreateWorkout:
      return handleCreateWorkout(request)
    default:
      throw Error(`Intent with name ${intentName} not supported.`)
  }
}

exports.handler = async request => {
  return dispatch(request)
}
