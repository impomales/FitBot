const router = require('express').Router()
const aws = require('aws-sdk')

// bot options
const LEX = 'LEX'
// const WATSON = 'WATSON';

let bot

// expects botOption in req that sets which bot to use.
router.post('/initiate', async (req, res, next) => {
  const {botOption} = req.body

  if (botOption === LEX) {
    bot = new aws.LexRuntime({region: 'us-east-1'})
    res.json(bot)
  } else {
    const err = new Error('Invalid bot option')
    next(err)
  }
})

module.exports = router
