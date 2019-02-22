import {AppPage, responsesToHi} from './app.po'
import {browser, logging, element, by} from 'protractor'

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

  it('can reply no to confirmation', () => {
    expect(
      page.sendMessage('how many calories are in 1 cup of rice', [
        '1 cup of rice have 205.4 calories. Would you like to log this item?'
      ])
    ).toBeTruthy()

    expect(
      page.sendMessage('no', [
        'Ok. This item has not been logged.',
        'Alright, I will not log',
        "OK. I won't log"
      ])
    ).toBeTruthy()
  })

  it('can get current user status', () => {
    expect(
      page.sendMessage('How much did I eat today?', ['You had'])
    ).toBeTruthy()

    element(by.css('#chat-history li:last-child'))
      .getText()
      .then(elemBefore => {
        expect(
          page.sendMessage('how many calories are in a banana?', [
            '1 banana has '
          ])
        ).toBeTruthy()

        expect(
          page.sendMessage('yes', ['When did you have banana?'])
        ).toBeTruthy()

        expect(
          page.sendMessage('breakfast', ['has been logged as a'])
        ).toBeTruthy()

        expect(
          page.sendMessage('How much did I eat today?', ['You had'])
        ).toBeTruthy()

        element(by.css('#chat-history li:last-child'))
          .getText()
          .then(elemAfter => {
            const statusBefore = Number(elemBefore.split(' ')[3])
            const statusAfter = Number(elemAfter.split(' ')[3])

            expect(statusAfter > statusBefore).toBeTruthy()
          })
      })
  })

  it('can switch bots', () => {
    element(by.css('option:checked'))
      .getAttribute('value')
      .then(bot => {
        let other
        if (bot === 'WATSON') other = 'LEX'
        else if (bot === 'LEX') other = 'DIALOG_FLOW'
        else if (bot === 'DIALOG_FLOW') other = 'WATSON'

        expect(
          page.sendMessage('how many calories are in a banana', [
            '1 banana has '
          ])
        ).toBeTruthy()

        page.switchBot(other)

        expect(
          page.sendMessage('how many calories are in a banana', [
            '1 banana has '
          ])
        ).toBeTruthy()

        page.switchBot(bot)

        expect(page.sendMessage('yes', ['when did you have'])).toBeTruthy()

        page.switchBot(other)

        expect(page.sendMessage('yes', ['when did you have'])).toBeTruthy()
      })
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
