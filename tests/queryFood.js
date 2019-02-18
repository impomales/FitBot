const {loginStep, sendMessage, switchBot} = require('../testHelpers')

module.exports = {
  'Log in': loginStep,
  'Querying food, and replying yes to confirmation': function(browser) {
    sendMessage(browser, 'how many calories are in a banana', [
      '1 banana has 105.02 calories. Would you like to log this item?'
    ])
    sendMessage(browser, 'yes', ['When did you have banana?'])
    sendMessage(browser, 'breakfast', ['has been logged as a'])
  },
  'Querying food, and replying no to confirmation': function(browser) {
    sendMessage(browser, 'how many calories are in  1 cup of rice', [
      '1 cup of rice have 205.4 calories. Would you like to log this item?'
    ])
    sendMessage(browser, 'no', [
      'Ok. This item has not been logged.',
      'Alright, I will not log',
      "OK. I won't log"
    ])
  },
  'Switching between bots': function(browser) {
    sendMessage(browser, 'how many calories are in a banana', [
      '1 banana has 105.02 calories. Would you like to log this item?'
    ])

    let bot = process.env.BOT,
      other
    console.log(bot)
    if (bot === 'WATSON') other = 'LEX'
    else if (bot === 'LEX') other = 'DIALOG_FLOW'
    else if (bot === 'DIALOG_FLOW') other = 'WATSON'

    switchBot(browser, other)

    sendMessage(browser, 'how many calories are in a banana', [
      '1 banana has 105.02 calories. Would you like to log this item?'
    ])

    switchBot(browser, bot)

    sendMessage(browser, 'yes', ['when did you have'])

    switchBot(browser, other)

    sendMessage(browser, 'yes', ['when did you have'])

    browser.end()
  }
}
