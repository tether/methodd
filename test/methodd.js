
/**
 * Test dependencies.
 */

const test = require('tape')
const service = require('..')


test('should create get router', assert => {
  assert.plan(1)
  const app = service()
  app.get('/', () => 'hello world!')
  assert.equal(app.get('/'), 'hello world!')
})
