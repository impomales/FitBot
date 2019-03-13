const {initiateLex, messageLex, handleResponseLex} = require('./lex')
const {
  initiateDialogFlow,
  messageDialogFlow,
  handleResponseDialogFlow
} = require('./dialogFlow')

const {
  initiateWatson,
  messageWatson,
  handleResponseWatson
} = require('./watson')

// const {initiateRasa, messageRasa, handleResponseRasa} = require('./rasa')

/**
 * bot object client interacts with.
 * @class
 * @property {Function} initiate creates a new service instance, returns a session id
 * @property {Function} message sends a user input, callback returns a response to user
 * @property {Function} handleResponse handles intent fulfillment, this is called within the callback of this.message
 */
class Bot {
  /**
   * creates a bot based on type param
   * @param {String} type identifies the bot service (Lex, Watson, or DialogFlow)
   */
  constructor(type) {
    this.type = type
    if (type === 'LEX') {
      this.initiate = initiateLex
      this.message = messageLex
      this.handleResponse = handleResponseLex
    } else if (type === 'DIALOG_FLOW') {
      this.initiate = initiateDialogFlow
      this.message = messageDialogFlow
      this.handleResponse = handleResponseDialogFlow
    } else if (type === 'WATSON') {
      this.initiate = initiateWatson
      this.message = messageWatson
      this.handleResponse = handleResponseWatson
    }
    // else if (type === 'RASA') {
    //   this.initiate = initiateRasa
    //   this.message = messageRasa
    //   this.handleResponse = handleResponseRasa
    // }
  }
}

module.exports = Bot
