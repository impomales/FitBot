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
  const bot = new Bot(option || process.env.BOT)

  if (bot.type === 'LEX') lexBot = bot
  else flowBot = bot

  if (!bot.initiate) next(new Error('Invalid bot option'))

  let sessionUserId = bot.initiate(req.user)
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

  bot.message(sessionUserId, text, async (err, response) => {
    if (err) next(err)
    else {
      try {
        const message = await bot.handleResponse(req.user, response)
        res.json({message})
      } catch (error) {
        err(error)
        next(error)
      }
    }
  })
})

module.exports = router
