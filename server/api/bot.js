const router = require('express').Router()

const bot = require('../bot')

// expects option in req that sets which bot to use.
router.post('/initiate', (req, res, next) => {
  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }

  if (!bot.initiate) next(new Error('Invalid bot option'))

  let sessionUserId = bot.initiate(req.user)

  res.json({bot, sessionUserId})
})

router.post('/message', (req, res, next) => {
  const {text, sessionUserId} = req.body
  console.log(bot.message)

  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }

  if (!sessionUserId) {
    res.status(401).send('Bot has not been initialized.')
    return
  }

  if (!bot.message) next(new Error('Invalid bot option'))

  bot.message(sessionUserId, text, (err, response) => {
    if (err) next(err)
    else res.json(response)
  })
})

module.exports = router
