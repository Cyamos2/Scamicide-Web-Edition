import request from 'supertest'
import app from '../src/server.js'

describe('POST /api/analyze', () => {
  test('returns analysis for valid text', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ text: 'We are hiring remote workers. Immediate start. Pay $20/hour.' })
      .set('Accept', 'application/json')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('score')
  })
})
