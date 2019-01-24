const router = require('express').Router()
const intentMap = require('../dialogFlowFulfillment')
const {WebhookClient} = require('dialogflow-fulfillment')

// webhook request send from dialogflow for fulfillment and slot filling.
router.post('/', (request, response) => {
  const agent = new WebhookClient({request, response})
  agent.handleRequest(intentMap)
})

module.exports = router
