const {expect} = require('chai')
const db = require('../db')
const User = db.model('user')
const caloriesRemaining = require('./caloriesRemaining')

describe('Bot method -- caloriesRemaining', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('caloriesRemaining', () => {
    let user,
      foodLog = {
        name: 'banana',
        quantity: 1,
        unit: 'cup',
        mealTime: 'lunch'
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

    it('can get the calories remaining from current user', async () => {
      let res = await caloriesRemaining(user)
      expect(res).equal(
        'You had 0 calories today. You still are 2000 calories away from your daily goal!'
      )
    })

    it('lets you know if a food item has been successfully logged', async () => {
      let res = await caloriesRemaining(user, foodLog)
      expect(res).equal(
        'Your 1 cup of banana has been logged as a lunch. You had 0 calories today. You still are 2000 calories away from your daily goal!'
      )
    })

    it("lets the user know if they've gone over their goals", async () => {
      user.dailyGoals = -2000
      let res = await caloriesRemaining(user)
      expect(res).equal(
        'You had 0 calories today. Uh oh! You went over your daily goals by 2000 calories today! You might want to go to the gym.'
      )
    })
  })
})
