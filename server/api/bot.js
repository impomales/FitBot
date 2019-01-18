const router = require('express').Router()

const aws = require('aws-sdk')
const randomstring = require('randomstring')

// bot options
const LEX = 'LEX'
// const WATSON = 'WATSON';

let bot, botOption

// expects option in req that sets which bot to use.
router.post('/initiate', async (req, res, next) => {
  const {option} = req.body

  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }

  if (option === LEX) {
    botOption = option
    bot = new aws.LexRuntime({region: 'us-east-1'})
    let sessionUserId = `${req.user.id}-${randomstring.generate()}`
    res.json({bot, sessionUserId})
  } else {
    const err = new Error('Invalid bot option')
    next(err)
  }
})

router.post('/message', (req, res, next) => {
  const {text, sessionUserId} = req.body

  if (!req.user) {
    res.status(401).send('Please log in.')
    return
  }

  if (!sessionUserId) {
    res.status(401).send('Bot has not been initialized.')
    return
  }

  if (botOption === LEX) {
    // user data is currently hard coded.
    // TODO link currently logged in user's data to session attributes.
    bot.postText(
      {
        botAlias: process.env.BOT_ALIAS,
        botName: process.env.BOT_NAME,
        userId: sessionUserId,
        inputText: text,
        sessionAttributes: {
          sessionUserId
          // enter user data here, calorie goals, currentCalories, weight, etc.
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
