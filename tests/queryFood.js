const {loginStep, sendMessage} = require('../testHelpers')

module.exports = {
  'Log in': loginStep,
  'Querying food, and replying yes to confirmation': function(browser) {
    sendMessage(browser, 'how many calories are in a banana', [
      '1 banana has 105.02 calories. Would you like to log this item?'
    ])
    sendMessage(browser, 'yes', ['When did you have banana?'])
    sendMessage(browser, 'breakfast', ['Your banana has been logged.'])
  },
  'Querying food, and replying no to confirmation': function(browser) {
    sendMessage(browser, 'how many calories are in  1 cup of rice', [
      '1 cup of rice have 205.4 calories. Would you like to log this item?'
    ])
    sendMessage(browser, 'no', [
      'Ok. This item has not been logged.',
      'Alright, I will not log it.',
      "OK. I won't log"
    ])
    browser.end()
  }
}
