import {AppPage, responsesToHi} from './app.po'
import {browser, logging} from 'protractor'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('should display welcome message', () => {
    page.navigateTo()
    expect(page.getTitleText()).toEqual('Fitbot')
  })

  it("can log in a user, and user can type 'hi'", async () => {
    page.navigateTo()
    page.login()
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/chat`)

    const result = await page.sendMessage('hi', responsesToHi)
    expect(result).toBeTruthy()
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER)
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE
      })
    )
  })
})
