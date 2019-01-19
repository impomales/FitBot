const {loginStep, sendMessage} = require('../testHelpers')

module.exports = {
  'Loggin in, and typing hi': function(browser) {
    loginStep(browser)
    sendMessage(
      browser,
      'hi',
      'Hello, I am your assistant Fitbot. How can I help you?'
    )
    browser.end()
  }
}
