const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('Food Log routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/foodLogs', () => {
    let user,
      auth = request.agent(app)
    const food = {
      name: 'apple',
      unit: 'oz',
      quantity: '2',
      weightInGrams: 56.7,
      calories: 29.5,
      mealTime: 'Breakfast'
    }
    beforeEach(async () => {
      user = await User.create({
        email: 'imp@email.com',
        username: 'Isaias',
        password: '123',
        dailyGoals: 2000,
        weight: 150
      })

      await auth
        .post('/auth/login')
        .send({email: 'imp@email.com', password: '123'})
        .expect(200)
    })

    it('POST /api/foodLogs', async () => {
      let res = await auth
        .post('/api/foodLogs')
        .send({foodLog: food, id: user.id})
        .expect(201)

      try {
        res = await auth.get(`/api/foodLogs`).expect(200)
      } catch (err) {
        res = err
      }

      expect(res.body).to.be.an('array')
      expect(res.body[0].name).to.equal(food.name)
    })
  })
})
