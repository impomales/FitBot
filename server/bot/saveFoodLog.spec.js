const {expect} = require('chai')
const db = require('../db')
const User = db.model('user')
const FoodLog = db.model('foodLog')
const saveFoodLog = require('./saveFoodLog')

describe('Bot method -- saveFood', () => {
  before(() => {
    return db.sync({force: true})
  })

  describe('saveFood', () => {
    let user

    const food = {
      name: 'apple',
      unit: 'oz',
      quantity: '2',
      weightInGrams: 56.7,
      calories: 29.5,
      mealTime: 'Breakfast'
    }

    before(async () => {
      user = await User.create({
        email: 'imp@email.com',
        username: 'Isaias',
        password: '123',
        dailyGoals: 2000,
        weight: 150
      })
    })

    it('stores a food log to the database', async () => {
      let logs = await FoodLog.findAll({})
      expect(logs.length).to.equal(0)

      let foodLog = await saveFoodLog(user, food)
      expect(foodLog.name).to.equal(food.name)
      expect(foodLog.userId).to.equal(user.id)

      logs = await FoodLog.findAll({})
      expect(logs.length).to.equal(1)
      expect(logs[0].name).to.equal(foodLog.name)
    })
  })
})
