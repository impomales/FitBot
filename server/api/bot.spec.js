const {expect} = require('chai')
const request = require('supertest')
const app = require('../index')

describe.only('Bot API routes', () => {
  let authUser = request.agent(app)
  before(async () => {
    await authUser
      .post('/auth/login')
      .send({email: 'cody@email.com', password: '123'})
      .expect(200)
  })

  it('/api/bot/initiate', async () => {
    const result = await authUser
      .post('/api/bot/initiate')
      .send({option: 'LEX'})
      .expect(200)

    expect(result.body.endpoint.host).to.equal(
      'runtime.lex.us-east-1.amazonaws.com'
    )

    // test unauth request
    await request(app)
      .post('/api/bot/initiate')
      .send({option: 'LEX'})
      .expect(401)
  })

  it('/api/bot/message', async () => {})
})
