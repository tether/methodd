
/**
 * Test dependencies.
 */

const test = require('tape')
const service = require('..')


test('should create basic get router', assert => {
  assert.plan(1)
  const app = service()
  app.get('/', () => 'hello world!')
  assert.equal(app.get('/'), 'hello world!')
})

test('should have static methods used for other things than routing', assert => {
  assert.plan(2)
  const app = service()
  assert.equal(typeof app.alias, 'function')
  assert.equal(typeof app.routes, 'function')
})


test('should create dynamic router', assert => {
  assert.plan(1)
  const app = service()
  app.options('/', () => 'hello world!')
  assert.equal(app.options('/'), 'hello world!')
})
