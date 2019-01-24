const {queryFood} = require('./intentHandlers')

let intentMap = new Map()
intentMap.set('QueryFood', queryFood)

module.exports = intentMap
