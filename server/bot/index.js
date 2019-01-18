const aws = require('aws-sdk')
const randomstring = require('randomstring')

class Bot {
  constructor(type) {
    this.type = type
    if (type === 'LEX') {
      this.initiate = initiateLex
      this.message = messageLex
    } else if (type === 'WATSON') {
      this.initiate = initiateWatson
      this.message = messageWatson
    }
  }
}

function initiateLex(user) {
  this.service = new aws.LexRuntime({region: 'us-east-1'})
  return `${user.id}-${randomstring.generate()}`
}

function messageLex(sessionUserId, text, callback) {
  this.service.postText(
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
    callback
  )
}

function initiateWatson() {
  /* TODO */
}

function messageWatson() {
  /* TODO */
}

module.exports = new Bot(process.env.BOT)
