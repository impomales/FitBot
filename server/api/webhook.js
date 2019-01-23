const router = require('express').Router()
const webhookClient = require('../dialogFlowFulfillment')

// webhook request send from dialogflow for fulfillment and slot filling.
router.post('/', (req, res, next) => {
  try {
    webhookClient(req, res)
  } catch (err) {
    next(err)
  }
})

module.exports = router
