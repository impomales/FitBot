const {QueryFood} = require('./intentTypes')
const {handleQueryFood} = require('./intentHandlers')

function dispatch(request) {
  const intentName = request.currentIntent.name

  switch (intentName) {
    case QueryFood:
      return handleQueryFood(request)
    default:
      throw Error(`Intent with name ${intentName} not supported.`)
  }
}

exports.handler = async request => {
  return dispatch(request)
}
