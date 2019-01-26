const responsesToHi = [
  'Hello, I am your assistant Fitbot. How can I help you?',
  'Greetings, I am Fibot! How can I assist?',
  'Good day! What can I do for you today?',
  'Hello! How can I help you?',
  'Hi! How are you doing?'
]

module.exports = {
  loginStep: function(browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .getTitle(function(title) {
        browser.expect(title).to.equal('Fitbot')
      })
      // test user log in.
      .setValue('input[name=email]', 'cody@email.com')
      .setValue('input[name=password]', '123')
      .click('button')
  },
  sendMessage: function(browser, message, responses) {
    browser
      .waitForElementVisible('#chat-main', 1000)
      .setValue('.inputField', message)
      .submitForm('#chat-main form')
      .pause(1500)
      .getText('#chat-history li:last-child', element => {
        browser.expect(responses.indexOf(element.value) !== -1).to.equal(true)
      })
  },
  responsesToHi
}
