const router = require('express').Router()

const Bot = require('../bot')

let lexBot, flowBot

// expects option in req that sets which bot to use.
router.post('/initiate', (req, res, next) => {
  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }
  const {option} = req.body
  const bot = new Bot(req.body.option || process.env.BOT)
  if (option === 'LEX') lexBot = bot
  else flowBot = bot

  if (!bot.initiate) next(new Error('Invalid bot option'))

  let sessionUserId = bot.initiate(req.user)
  console.log(bot.message)
  res.json({bot, sessionUserId})
})

router.post('/message', (req, res, next) => {
  const {text, sessionUserId, option} = req.body
  const bot = option === 'LEX' ? lexBot : flowBot

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
