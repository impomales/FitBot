const {
  queryFood,
  queryFoodServingSize,
  queryFoodLogYes,
  status
} = require('./intentHandlers')

let intentMap = new Map()
intentMap.set('QueryFood', queryFood)
intentMap.set('QueryFood - servingsize', queryFoodServingSize)
intentMap.set('QueryFood - log-yes', queryFoodLogYes)

module.exports = intentMap
