module.exports = {
  'Demo test': browser => {
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
      // test chat ui.
      .waitForElementVisible('#chat-main', 1000)
      .setValue('.inputField', 'hi')
      .submitForm('#chat-main form')
      .pause(1000)
      .getText('#chat-history li:last-child', function(element) {
        console.log(element.value)
        browser
          .expect(element.value)
          .to.equal('Hello, I am your assistant Fitbot. How can I help you?')
      })
      .end()
  }
}
