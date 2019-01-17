module.exports = {
  'Demo test': browser => {
    console.log(browser.globals)
    browser.url(browser.launchUrl).end()
  }
}
