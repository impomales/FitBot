import {AppPage, responsesToHi} from './app.po'
import {browser, logging} from 'protractor'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
    page.navigateTo()
  })

  it('should display welcome message', () => {
    expect(page.getTitleText()).toEqual('Fitbot')
  })

  it("can log in a user, and user can type 'hi'", () => {
    page.login()
    expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/chat`)
    expect(page.sendMessage('hi', responsesToHi)).toBeTruthy()
  })

  it('can query food, and user replies yes to confirmation', () => {
    expect(
      page.sendMessage('how many calories are in a banana', [
        '1 banana has 105.02 calories. Would you like to log this item?'
      ])
    ).toBeTruthy()

    expect(page.sendMessage('yes', ['When did you have banana?'])).toBeTruthy()
    expect(page.sendMessage('breakfast', ['has been logged as a'])).toBeTruthy()
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
