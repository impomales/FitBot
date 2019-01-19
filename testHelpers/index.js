module.exports = {
  loginStep: function(browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .getTitle(function(title) {
        browser.expect(title).to.equal('Fitbot')
      })
      // test user log in.
      .setValue('input[name=email]', 'imp@email.com')
      .setValue('input[name=password]', '12345')
      .click('button')
  },
  sendMessage: function(browser, message, response) {
    browser
      .waitForElementVisible('#chat-main', 1000)
      .setValue('.inputField', message)
      .submitForm('#chat-main form')
      .pause(1000)
      .getText('#chat-history li:last-child', element => {
        browser.expect(element.value).to.equal(response)
      })
  }
}
