const {WebhookClient} = require('dialogflow-fulfillment')
const {queryFood} = require('./intentHandlers')

module.exports = function(request, response) {
  const agent = new WebhookClient({request, response})

  let intentMap = new Map()
  intentMap.set('QueryFood', queryFood)
  agent.handleRequest(intentMap)
}
