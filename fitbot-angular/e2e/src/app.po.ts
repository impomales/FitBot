import {browser, by, element} from 'protractor'

export const responsesToHi = [
  'Hello, I am your assistant Fitbot. How can I help you?',
  'Greetings, I am Fitbot! How can I assist?',
  'Good day! I am Fitbot. What can I do for you today?',
  'Hello! How can I help you?',
  'Hi! How are you doing?',
  'Hello, I am your assistant Fitbot. How can I help you?'
]

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>
  }

  login() {
    element(by.css('input[name=email]')).sendKeys('cody@email.com')
    element(by.css('input[name=password')).sendKeys('123')
    return element(by.css('button')).click() as Promise<void>
  }

  async sendMessage(message: string, responses: string[]) {
    element(by.css('.input-field')).sendKeys(message)
    element(by.css('#chat-main form')).submit()

    return element(by.css('#chat-history li:last-child'))
      .getText()
      .then(lastMessage => {
        return responses.some(response =>
          lastMessage.toLowerCase().includes(response.toLowerCase())
        ) as boolean
      })
  }
}
