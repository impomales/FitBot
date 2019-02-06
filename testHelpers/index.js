const responsesToHi = [
  'Hello, I am your assistant Fitbot. How can I help you?',
  'Greetings, I am Fitbot! How can I assist?',
  'Good day! I am Fitbot. What can I do for you today?',
  'Hello! How can I help you?',
  'Hi! How are you doing?',
  'Hello, I am your assistant Fitbot. How can I help you?'
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
      .setValue('.input-field', message)
      .submitForm('#chat-main form')
      .pause(2000)
      .getText('#chat-history li:last-child', element => {
        browser
          .expect(
            responses.some(response =>
              element.value.toLowerCase().includes(response.toLowerCase())
            )
          )
          .to.equal(true)
      })
  },
  switchBot: function(browser, value) {
    browser
      .click('select[name=option]')
      .click(`option[value=${value}]`)
      .pause(2000)
  },
  responsesToHi
}
