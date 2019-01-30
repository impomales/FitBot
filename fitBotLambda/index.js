const {QueryFood, CaloriesRemaining, LogFood} = require('./intentTypes')
const {
  handleQueryFood,
  handleCaloriesRemaining,
  handleLogFood
} = require('./intentHandlers')

function dispatch(request) {
  const intentName = request.currentIntent.name

  switch (intentName) {
    case QueryFood:
      return handleQueryFood(request)
    case CaloriesRemaining:
      return handleCaloriesRemaining(request)
    case LogFood:
      return handleLogFood(request)
    default:
      throw Error(`Intent with name ${intentName} not supported.`)
  }
}

exports.handler = async request => {
  return dispatch(request)
}
