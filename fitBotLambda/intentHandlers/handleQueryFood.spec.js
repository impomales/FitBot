const {expect} = require('chai')
const {
  handleQueryFood,
  buildFoodQuery,
  buildFoodQueryResult
} = require('./handleQueryFood')

describe('Handle Query Food', () => {
  describe('helper functions', () => {
    it('can build a food query', () => {
      expect(buildFoodQuery('apple', 1, 'cup')).to.equal('1 cup of apple')
      expect(buildFoodQuery('apple', 2, 'cup')).to.equal('2 cups of apple')
      expect(buildFoodQuery('banana', 1)).to.equal('1 banana')
      expect(buildFoodQuery('banana', 2)).to.equal('2 bananas')
    })

    it('can build a food query result', () => {})
  })
})
