const randomstring = require('randomstring')
const axios = require('axios')
const saveFoodLog = require('./saveFoodLog')
const caloriesRemaining = require('./caloriesRemaining')
const {queryFood} = require('../../fitbotWatsonCall')

function initiateRasa(user) {
  return `${user.id}-${randomstring.generate()}`
}

function messageRasa(sessionUserId, text, callback) {
  axios
    .post(
      `http://localhost:5005/webhooks/rest/webhook?token=${
        process.env.RASA_SECRET
      }`,
      {sender: sessionUserId, message: text}
    )
    .then(res => res.data)
    .then(response => callback(null, response))
    .catch(err => callback(err))
}

function handleResponseRasa(user, response) {
  const {text, attachment} = response[0]

  if (text) return text
  else if (attachment) {
    if (attachment.action === 'status') return caloriesRemaining(user)
  }
}

module.exports = {initiateRasa, messageRasa, handleResponseRasa}
