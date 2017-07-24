
/**
 * Test dependencies.
 */

const test = require('tape')
const service = require('..')


test('should create basic get route', assert => {
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

test('should create dynamic method(s) for routing', assert => {
  assert.plan(2)
  const app = service()
  app.options('/', () => 'hello world!')
  app.hellofoo('/', () => 'hello foo!')
  assert.equal(app.options('/'), 'hello world!')
  assert.equal(app.hellofoo('/'), 'hello foo!')
})

test('should create multiple routes for one method', assert => {
  assert.plan(2)
  const app = service()
  app.get('/', () => 'hello world')
  app.get('/foo', () => 'hello foo')
  assert.equal(app.get('/'), 'hello world')
  assert.equal(app.get('/foo'), 'hello foo')
})

test('should create multiple routes for different methods', assert => {
  assert.plan(3)
  const app = service()
  app.get('/', () => 'get world')
  app.post('/', () => 'post world')
  app.post('/foo', () => 'post foo')
  assert.equal(app.get('/'), 'get world')
  assert.equal(app.post('/'), 'post world')
  assert.equal(app.post('/foo'), 'post foo')
})

test('should pass arguments to routes', assert => {
  assert.plan(2)
  const app = service()
  app.get('/', (query, data) => {
    assert.deepEqual(query, {
      foo: 'bar'
    })
    assert.equal(data, 'hello world')
  })
  app.get('/', {
    foo: 'bar'
  }, 'hello world')
})

test('should accept regexp routes and mixin object arguments', assert => {
  assert.plan(2)
  const app = service()
  app.get('/:name', query => {
    assert.equal(query.name, 'foo')
    assert.equal(query.city, 'calgary')
  })
  app.get('/foo', {
    city: 'calgary'
  })
})

test('should return undefined if route does not exist', assert => {
  assert.plan(1)
  const app = service()
  let result
  app.get('/', () => result = 'something')
  app.post('/hello', () => result = 'something')
  app.get('/:other/:name', () => result = 'something')
  app.get('/hello')
  assert.equal(result == null, true)
})

test('should keep silent if route has not been defined', assert => {
  assert.plan(1)
  const app = service()
  app.get('/hello')
  assert.ok('test passed')
})
