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
  let proxied
  const original = function (...args) {
    return cb.apply(proxied, args)
  }

  /**
   * Add a method router.
   *
   * @param {String} key
   * @param {String} path
   * @param {Function} cb
   * @api public
   */

  original.add = (key, path, cb) => {
    const obj = routes[key] || router()
    obj.add(path, cb)
    routes[key] = obj
  }

  /**
   * Create alias for method routes.

   * @param {String} key
   * @param {String} path
   * @param {Function } cb
   * @api public
   */

  original.alias = original.add
  original.routes = () => {

  }
  proxied =  proxy(original, routes)
  return proxied
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
