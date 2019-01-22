const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')
const app2 = require('../index')
const db = require('../db')
const User = db.model('user')

describe('Bot API routes', () => {
  let authUser = request.agent(app)
  let authUser2 = request.agent(app2)
  let sessionUserId
  before(async () => {
    await db.sync({force: true})

    await User.create({
      email: 'cody@email.com',
      username: 'cody',
      password: '123',
      dailyGoals: 2500,
      weight: 150
    })

    await User.create({
      email: 'murphy@email.com',
      username: 'murph',
      password: '123',
      dailyGoals: 1500,
      weight: 120
    })

    await authUser
      .post('/auth/login')
      .send({email: 'cody@email.com', password: '123'})
      .expect(200)

    await authUser2
      .post('/auth/login')
      .send({email: 'murphy@email.com', password: '123'})
      .expect(200)
  })

  it('/api/bot/initiate', async () => {
    const result = await authUser.post('/api/bot/initiate').expect(200)

    expect(result.body.bot.service.endpoint.host).to.equal(
      'runtime.lex.us-east-1.amazonaws.com'
    )
    sessionUserId = result.body.sessionUserId

    // test unauth request
    await request(app)
      .post('/api/bot/initiate')
      .expect(401)
  })

  it('/api/bot/message', async () => {
    let result
    result = await authUser
      .post('/api/bot/message')
      .send({text: 'hi', sessionUserId})
      .expect(200)

    expect(result.body.message).to.equal(
      'Hello, I am your assistant Fitbot. How can I help you?'
    )

    // send message w/o init
    result = await authUser2
      .post('/api/bot/message')
      .send({text: 'hi'})
      .expect(401)

    expect(result.error.text).to.equal('Bot has not been initialized.')

    // unauth
    await request(app)
      .post('/api/bot/message')
      .send({text: 'hi'})
      .expect(401)
  })
})
