const {queryFood, queryFoodServingSize} = require('./intentHandlers')

let intentMap = new Map()
intentMap.set('QueryFood', queryFood)
intentMap.set('QueryFood - servingsize', queryFoodServingSize)

module.exports = intentMap
