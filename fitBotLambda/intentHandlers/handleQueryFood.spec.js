/* eslint-disable no-unused-expressions */
const {expect} = require('chai')
const {
  handleQueryFood,
  buildFoodQuery,
  buildFoodQueryResult
} = require('./handleQueryFood')

describe('Handle Query Food', () => {
  describe('helper functions', () => {
    const milkInfo = {
      foods: [
        {
          food_name: 'milk',
          serving_qty: 1,
          serving_unit: 'cup',
          serving_weight_grams: 245,
          nf_calories: 124.95
        }
      ]
    }

    const carrotInfo = {
      foods: [
        {
          food_name: 'carrot',
          serving_qty: 1,
          serving_unit: 'carrot',
          serving_weight_grams: '46',
          nf_calories: 16.1
        }
      ]
    }

    it('can build a food query', () => {
      expect(buildFoodQuery('apple', 1, 'cup')).to.equal('1 cup of apple')
      expect(buildFoodQuery('apple', 2, 'cup')).to.equal('2 cups of apple')
      expect(buildFoodQuery('banana', 1)).to.equal('1 banana')
      expect(buildFoodQuery('banana', 2)).to.equal('2 bananas')
    })

    it('can build a food query result', () => {
      // when serving unit is specified.
      expect(buildFoodQueryResult(milkInfo, 'cup')).to.equal(
        '1 cup of milk has 124.95 calories.'
      )

      milkInfo.foods[0].serving_qty = 5
      milkInfo.foods[0].nf_calories *= 5
      expect(buildFoodQueryResult(milkInfo, 'cup')).to.equal(
        '5 cups of milk has 624.75 calories.'
      )

      // when serving unit is not specified.
      expect(buildFoodQueryResult(carrotInfo)).to.equal(
        '1 carrot has 16.1 calories.'
      )
      carrotInfo.foods[0].serving_qty = 10
      carrotInfo.foods[0].nf_calories *= 10
      expect(buildFoodQueryResult(carrotInfo)).to.equal(
        '10 carrots have 161 calories.'
      )
    })
  })

  describe('handleQueryFood', () => {
    const request = {
      currentIntent: {
        slots: {
          FoodQueryName: 'apple',
          FoodQueryQuantity: null,
          FoodQueryUnit: null
        },
        name: 'QueryFood'
      },
      invocationSource: 'DialogCodeHook',
      sessionAttributes: {},
      inputTranscript: 'How many calories are in an apple?'
    }
    it("can handle when user specifies a quantity using 'a' or 'an'", () => {
      const result = handleQueryFood(request)
      expect(result.dialogAction.type).to.equal('Delegate')
      expect(result.dialogAction.slots.FoodQueryQuantity).to.equal('1')
    })
    // test fulfillment hook
    it('can process a fulfillment hook', async () => {
      request.invocationSource = 'FulfillmentCodeHook'
      const result = await handleQueryFood(request)
      expect(result.dialogAction.type).to.equal('ConfirmIntent')
      expect(result.dialogAction.intentName).to.equal('LogFood')
      expect(result.dialogAction.slots.Calories).to.not.be.null
    })
  })
})
