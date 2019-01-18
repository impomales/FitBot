const {expect} = require('chai')
const {
  handleQueryFood,
  buildFoodQuery,
  buildFoodQueryResult
} = require('./handleQueryFood')

describe('Handle Query Food', () => {
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

  describe('helper functions', () => {
    it('can build a food query', () => {
      expect(buildFoodQuery('apple', 1, 'cup')).to.equal('1 cup of apple')
      expect(buildFoodQuery('apple', 2, 'cup')).to.equal('2 cups of apple')
      expect(buildFoodQuery('banana', 1)).to.equal('1 banana')
      expect(buildFoodQuery('banana', 2)).to.equal('2 bananas')
    })

    it('can build a food query result', () => {
      expect(buildFoodQueryResult(milkInfo, 'cup')).to.equal(
        '1 cup of milk has 124.95 calories.'
      )
      expect(buildFoodQueryResult(carrotInfo)).to.equal(
        '1 carrot has 16.1 calories.'
      )

      milkInfo.foods[0].serving_qty = 5
      milkInfo.foods[0].nf_calories *= 5
      expect(buildFoodQueryResult(milkInfo, 'cup')).to.equal(
        '5 cups of milk has 624.75 calories.'
      )

      carrotInfo.foods[0].serving_qty = 10
      carrotInfo.foods[0].nf_calories *= 10
      expect(buildFoodQueryResult(carrotInfo)).to.equal(
        '10 carrots have 161 calories.'
      )
    })
  })
})
