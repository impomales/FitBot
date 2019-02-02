const {expect} = require('chai')
const {queryFood, queryFoodServingSize} = require('./queryFood')

describe.only('Dialog Flow -- Handle Query Food', () => {
  let agent
  beforeEach(() => {
    agent = {
      result: '',
      parameters: {
        name: null,
        servingType: null,
        servingWeight: {amount: null, unit: null},
        servingVolume: {amount: null, unit: null},
        servingWeightName: null,
        servingVolumeName: null,
        quantity: null,
        indefiniteArticle: null
      },
      add: function(message) {
        this.result = message
      },
      context: {
        parameters: {
          'queryfood-followup': {}
        },
        get: function(name) {
          return this.parameters[name]
        },
        set: function(name, lifespan, parameters) {
          this.parameters[name] = parameters
        }
      }
    }
  })

  describe('queryFood', () => {
    it('can handle a when a food item name is missing', async () => {
      agent.parameters.quantity = '2'
      await queryFood(agent)
      expect(agent.result).to.equal('Please enter a food item.')
    })

    it('can handle a when serving size is missing', async () => {
      agent.parameters.name = 'apple'
      await queryFood(agent)
      expect(agent.result).to.equal('Please enter a serving size.')
    })

    it('can process a fulfillment', async () => {
      agent.parameters.name = 'apple'
      agent.parameters.quantity = '1'
      await queryFood(agent)
      expect(agent.result).to.equal(
        '1 apple has 94.64 calories. Would you like to log this item?'
      )
      expect(agent.context.parameters['queryfood-followup'].calories).to.equal(
        94.64
      )

      agent.parameters.name = 'wine'
      agent.parameters.servingType = 'glass'

      await queryFood(agent)
      expect(agent.result).to.equal(
        '1 glass of wine has 122.01 calories. Would you like to log this item?'
      )
      expect(agent.context.parameters['queryfood-followup'].calories).to.equal(
        122.01
      )

      agent.parameters.servingType = null
      agent.parameters.quantity = null
      agent.parameters.servingVolume.amount = 3
      agent.parameters.servingVolume.unit = 'cup'

      await queryFood(agent)
      expect(agent.result).to.equal(
        '3 cups of wine has 585.65 calories. Would you like to log this item?'
      )
      expect(agent.context.parameters['queryfood-followup'].calories).to.equal(
        585.65
      )
    })

    it('can handle a failure', async () => {
      agent.parameters.name = 'pony'
      agent.parameters.quantity = '2'
      await queryFood(agent)
      expect(agent.result).to.equal(
        "We couldn't match any of your foods. Please try again."
      )
    })
  })
})
