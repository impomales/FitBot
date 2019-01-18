const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')
const app2 = require('../index')

describe('Bot API routes', () => {
  let authUser = request.agent(app)
  let authUser2 = request.agent(app2)
  let sessionUserId
  before(async () => {
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
    const result = await authUser
      .post('/api/bot/initiate')
      .send({option: 'LEX'})
      .expect(200)

    expect(result.body.bot.endpoint.host).to.equal(
      'runtime.lex.us-east-1.amazonaws.com'
    )
    sessionUserId = result.body.sessionUserId

    // test unauth request
    await request(app)
      .post('/api/bot/initiate')
      .send({option: 'LEX'})
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
