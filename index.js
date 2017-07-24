/**
 * Dependencies.
 */

const router = require('./lib/router')


/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function (cb) {
  const routes = {}

  const original = function (...args) {
    return cb && cb(...args)
  }


  /**
   * Add a method router.
   *
   * @param {String} key
   * @param {String} path
   * @param {Function} cb
   * @api public
   */

  const add = (key, path, cb) => {
    const obj = routes[key] || router()
    obj.add(path, cb)
    routes[key] = obj
  }

  /**
   * Add method(s)
   *
   * @param {String} key
   * @param {String} path
   * @param {Function} cb
   * @api public
   */

  original.add = (keys, path, cb) => {
    if (typeof keys === 'object') {
      Object.keys(keys).map(key => {
        const method = keys[key]
        Object.keys(method).map(p => {
          add(key, p, method[p])
        })
      })
    } else {
      add(keys, path, cb)
    }
  }

  /**
   * Create alias for method routes.

   * @param {String} key
   * @param {String} path
   * @param {Function } cb
   * @api public
   */

  original.alias = original.add

  original.use = (other) => {
    const methods = other.routes()
    Object.keys(methods)
      .map(key => {
      })
  }

  original.routes = () => {
    return routes
  }
  return proxy(original, routes)
}


/**
 * Proxy function with router.
 *
 * @param {Function} original
 * @param {Object} routes
 * @api private
 */

function proxy (original, routes) {
  return new Proxy(original, {
    get(target, key, receiver) {
      const method = target[key]
      if (method) return method
      else return function (path, ...args) {
        const cb = args[0]
        if (typeof cb === 'function') {
          original.add(key, path, cb)
        } else {
          const fn = routes[key]
          return fn && fn.exec(path, ...args)
        }
      }
    }
  })
}
