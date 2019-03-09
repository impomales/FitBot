const router = require('express').Router()
const fs = require('fs')
const {exec} = require('child_process')

const Bot = require('../bot')

let lexBot, flowBot, watsonBot, rasaBot

// expects option in req that sets which bot to use.
// eslint-disable-next-line complexity
router.post('/initiate', (req, res, next) => {
  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }
  const {option} = req.body
  const bot = new Bot(option || process.env.BOT)

  if (bot.type === 'LEX') lexBot = bot
  else if (bot.type === 'DIALOG_FLOW') flowBot = bot
  else if (bot.type === 'WATSON') watsonBot = bot
  else if (bot.type === 'RASA') rasaBot = bot

  if (!bot.initiate) next(new Error('Invalid bot option'))

  let sessionUserId
  if (bot.type === 'WATSON') {
    sessionUserId = bot.initiate((err, result) => {
      if (err) throw new Error(`Bot initialization failed ${err}`)
      sessionUserId = result.session_id
      const resBot = {
        type: bot.type
      }

      res.json({bot: resBot, sessionUserId})
    })
  } else {
    sessionUserId = bot.initiate(req.user)
    // for security purposes only returns these params.
    const resBot = {
      type: bot.type
    }

    res.json({bot: resBot, sessionUserId})
  }
})

router.post('/message', (req, res, next) => {
  const {text, sessionUserId, option} = req.body
  let bot
  if (option === 'LEX') bot = lexBot
  else if (option === 'DIALOG_FLOW') bot = flowBot
  else if (option === 'WATSON') bot = watsonBot
  else if (option === 'RASA') bot = rasaBot

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
        // handle fulfillment here before sending response back to user.
        const message = await bot.handleResponse(req.user, response)
        res.json({message})
      } catch (error) {
        next(error)
      }
    }
  })
})

router.post('/train', (req, res, next) => {
  const {trainingData} = req.body

  fs.writeFile(
    './fitbot-rasa/data/training_data.json',
    JSON.stringify(trainingData, null, 2),
    err => {
      if (err) {
        next(err)
        return
      }

      exec(
        'cd fitbot-rasa && make train-nlu-json && cd ..',
        (execErr, stdout, stderr) => {
          if (execErr) {
            next(execErr)
            return
          }

          console.log(stdout)
          console.log(stderr)
          res.json({message: 'bot was successfully updated'})
        }
      )
    }
  )
})

router.get('/load_nlu', (req, res, next) => {
  fs.readFile('./fitbot-rasa/data/training_data.json', 'utf-8', (err, file) => {
    if (err) {
      next(err)
      return
    }
    res.json(JSON.parse(file))
  })
})

module.exports = router
