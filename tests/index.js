module.exports = {
  'Demo test': browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .getTitle(function(title) {
        browser.expect(title).to.equal('Fitbot')
      })
      // TODO test user log in.
      .end()
  }
}
