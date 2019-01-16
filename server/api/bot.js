const router = require('express').Router()

const aws = require('aws-sdk')

// bot options
const LEX = 'LEX'
// const WATSON = 'WATSON';

let bot, botOption, sessionUserId

// expects option in req that sets which bot to use.
router.post('/initiate', async (req, res, next) => {
  const {option} = req.body

  if (option === LEX) {
    botOption = option
    bot = new aws.LexRuntime({region: 'us-east-1'})
    res.json(bot)
  } else {
    const err = new Error('Invalid bot option')
    next(err)
  }
})

router.post('/message', (req, res, next) => {
  const {text} = req.body

  if (!bot) {
    const err = new Error('Bot has not been initialized.')
    next(err)
  }

  if (botOption === LEX) {
    // user data is currently hard coded.
    // TODO link currently logged in user's data to session attributes.
    bot.postText(
      {
        botAlias: process.env.BOT_ALIAS,
        botName: process.env.BOT_NAME,
        userId: '2-isaias',
        inputText: text,
        sessionAttributes: {
          userGoals: '1200'
        }
      },
      (err, response) => {
        if (err) next(err)
        else res.json(response)
      }
    )
  } else {
    const err = new Error('Invalid bot option')
    next(err)
  }
})

module.exports = router
