const {loginStep, sendMessage, responsesToHi} = require('../testHelpers')

module.exports = {
  'Loggin in, and typing hi': function(browser) {
    loginStep(browser)
    sendMessage(browser, 'hi', responsesToHi)
    browser.end()
  }
}
