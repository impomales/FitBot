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
    // TODO implement later.
    browser.end()
  }
}
