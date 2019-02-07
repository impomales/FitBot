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

class Bot {
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
  }
}

module.exports = Bot
