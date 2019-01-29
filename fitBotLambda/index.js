const {QueryFood, CaloriesRemaining} = require('./intentTypes')
const {handleQueryFood, handleCaloriesRemaining} = require('./intentHandlers')

function dispatch(request) {
  const intentName = request.currentIntent.name

  switch (intentName) {
    case QueryFood:
      return handleQueryFood(request)
    case CaloriesRemaining:
      return handleCaloriesRemaining(request)
    default:
      throw Error(`Intent with name ${intentName} not supported.`)
  }
}

exports.handler = async request => {
  return dispatch(request)
}
