const {loginStep, sendMessage} = require('../testHelpers')

module.exports = {
  'Log in': loginStep,
  'Asking current status': function(browser) {
    sendMessage(browser, 'How much did I eat today?', ['You had'])
    browser.getText('#chat-history li:last-child', elemBefore => {
      sendMessage(browser, 'how many calories are in a banana', [
        '1 banana has 105.02 calories. Would you like to log this item?'
      ])
      sendMessage(browser, 'yes', ['When did you have banana?'])
      sendMessage(browser, 'breakfast', ['has been logged as a'])
      sendMessage(browser, 'How much did I eat today?', ['You had'])
      browser.getText('#chat-history li:last-child', elemAfter => {
        const statusBefore = Number(elemBefore.value.split(' ')[3])
        const statusAfter = Number(elemAfter.value.split(' ')[3])
        browser.expect(statusAfter > statusBefore).equal(true)
        browser.end()
      })
    })
  }
}
