
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
  assert.plan(3)
  const app = service()
  assert.equal(typeof app.add, 'function')
  assert.equal(typeof app.alias, 'function')
  assert.equal(typeof app.routes, 'function')
})

test('should add method for routing', assert => {
  assert.plan(1)
  const app = service()
  app.add('get', '/hello', () => 'hello world')
  assert.equal(app.get('/hello'), 'hello world')
})

test('should add multiple method for routing', assert => {
  assert.plan(3)
  const app = service()
  app.add({
    'get': {
      '/': () => 'hello world',
      '/foo': () => 'hello foo'
    },
    'post': {
      '/': () => 'something'
    }
  })
  assert.equal(app.get('/'), 'hello world')
  assert.equal(app.get('/foo'), 'hello foo')
  assert.equal(app.post('/'), 'something')
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

test('should alias route', assert => {
  assert.plan(1)
  const app = service()
  app.alias('get', '/hello', '/foo/bar')
  app.get('/foo/bar', () => assert.ok('test passed'))
  app.get('/hello')
})

// test('should alias regexp route', assert => {
//   assert.plan(1)
//   const app = service()
//   app.alias('get', '/:name', '/foo/bar?id=:name')
//   app.get('/foo/bar', (query) => {
//     assert.equal(query.id, 'hello')
//   })
//   app.get('/hello')
// })

test('should return a function', assert => {
  assert.plan(1)
  assert.equal(typeof service(), 'function')
})

test('should accept middleware function', assert => {
  assert.plan(2)
  const app = service(function(req) {
    return app[req.method](req.url)
  })

  app.get('/hello', () => {
    assert.ok('test passed')
    return 'hello world'
  })
  const result = app({
    method: 'get',
    url: '/hello'
  })
  assert.equal(result, 'hello world')
})

// test('should merge two service', assert => {
//   assert.plan(2)
//   const one = service()
//   one.get('/hello', () => 'hello world')
//   const two = service()
//   two.get('/', () => 'welcome')
//   two.use(one)
//   assert.equal(two.get('/'), 'welcome')
//   assert.equal(two.get('/hello'), 'welcome')
// })
