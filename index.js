
/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function () {
  const routes = {}
  const original = {
    alias: () => {},
    routes: () => {}
  }
  return new Proxy(original, {
    get(target, key, receiver) {
      const method = target[key]
      if (method) return method
      else return function (path, ...args) {
        const cb = args[0]
        if (typeof cb === 'function') {
          const obj = routes[key] || {}
          obj[path] = cb
          routes[key] = obj
        } else {
          return routes[key][path](...args)
        }
      }
    }
  })
}
