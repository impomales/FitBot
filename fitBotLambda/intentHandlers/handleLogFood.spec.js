const {expect} = require('chai')
const {handleLogFood} = require('./handleLogFood')

describe('Lex -- Handle Log Food', () => {
  describe('handleLogFood', () => {
    let request, response

    beforeEach(() => {
      request = {
        currentIntent: {
          slots: {
            FoodLogName: '',
            FoodLogQuantity: 0,
            FoodLogUnit: ''
          },
          name: 'LogFood',
          confirmationStatus: ''
        },
        invocationSource: '',
        sessionAttributes: {},
        inputTranscript: ''
      }
    })

    it('does not log if user denies confirmation', async () => {
      request.currentIntent.slots.FoodLogName = 'apple'
      request.currentIntent.confirmationStatus = 'Denied'
      const responses = [
        'Ok. This item has not been logged.',
        'Alright. I will not log it.',
        `OK. I won't log ${request.currentIntent.slots.FoodLogName}.`
      ]
      response = await handleLogFood(request)
      expect(response.dialogAction.fulfillmentState).to.equal('Fulfilled')
      expect(
        responses.includes(response.dialogAction.message.content)
      ).to.equal(true)
    })

    it('asks for serving unit if user only types a food name', async () => {
      request.currentIntent.slots.FoodLogName = 'apple'
      request.currentIntent.confirmationStatus = 'Confirmed'
      request.invocationSource = 'DialogCodeHook'

      response = await handleLogFood(request)
      expect(response.dialogAction.type).to.equal('ElicitSlot')
      expect(response.dialogAction.slotToElicit).to.equal('FoodLogUnit')
    })

    it('fetches calories if not defined', async () => {
      request.currentIntent.slots.FoodLogName = 'apple'
      request.currentIntent.slots.FoodLogQuantity = 2
      request.currentIntent.slots.FoodLogUnit = 'cup'
      request.currentIntent.confirmationStatus = 'Confirmed'
      request.invocationSource = 'DialogCodeHook'

      response = await handleLogFood(request)
      expect(response.dialogAction.type).to.equal('ConfirmIntent')
      expect(response.dialogAction.intentName).to.equal('LogFood')
      expect(response.dialogAction.message.content).to.equal(
        '2 cups of apple has 121.68 calories. Would you like to log this item?'
      )
    })

    it('handles failure if food not found', async () => {
      request.currentIntent.slots.FoodLogName = 'pony'
      request.currentIntent.slots.FoodLogQuantity = 2
      request.currentIntent.slots.FoodLogUnit = 'cup'
      request.currentIntent.confirmationStatus = 'Confirmed'
      request.invocationSource = 'DialogCodeHook'

      response = await handleLogFood(request)
      expect(response.dialogAction.type).to.equal('Close')
      expect(response.dialogAction.fulfillmentState).to.equal('Failed')
    })

    it('delegates otherwise', async () => {
      request.currentIntent.slots.FoodLogName = 'apple'
      request.currentIntent.slots.FoodLogQuantity = 2
      request.currentIntent.slots.FoodLogUnit = 'cup'
      request.currentIntent.slots.Calories = 121.68
      request.currentIntent.confirmationStatus = 'Confirmed'
      request.invocationSource = 'DialogCodeHook'

      response = await handleLogFood(request)
      expect(response.dialogAction.type).to.equal('Delegate')
    })
  })
})
