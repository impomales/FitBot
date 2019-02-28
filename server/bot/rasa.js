const randomstring = require('randomstring')
const axios = require('axios')
const saveFoodLog = require('./saveFoodLog')
const caloriesRemaining = require('./caloriesRemaining')

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

async function handleResponseRasa(user, response) {
  if (!response.length) {
    return "Sorry, I don't understand. Please try again."
  }

  const {text, attachment} = response[0]

  if (text) return text
  else if (attachment) {
    if (attachment.action === 'status') return caloriesRemaining(user)
    if (attachment.action === 'logFood') {
      // handle food log
      const {
        calories,
        mealtime,
        name,
        quantity,
        unit,
        // eslint-disable-next-line camelcase
        weight_in_grams
      } = attachment

      const foodLog = {
        name,
        quantity,
        // eslint-disable-next-line camelcase
        weightInGrams: weight_in_grams,
        calories,
        mealTime: mealtime,
        unit
      }

      try {
        const newLog = await saveFoodLog(user, foodLog)
        if (newLog.name) return caloriesRemaining(user, newLog)
      } catch (err) {
        return err
      }
    }
  }
}

module.exports = {initiateRasa, messageRasa, handleResponseRasa}
