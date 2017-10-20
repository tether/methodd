/**
 * Dependencies.
 */

const regexp = require('path-to-regexp')


/**
 * Router factory.
 *
 * @return {Object}
 * @api private
 */

module.exports = function () {
  const staticRoutes = {}
  const dynamicRoutes = []
  return {
    add(path, cb) {
      const keys = []
      const match = regexp(path, keys)
      if (!keys.length) {
        staticRoutes[path] = cb
      } else {
        dynamicRoutes.push({
          re: match,
          fn: cb,
          path: path,
          keys: keys
        })
      }
    },

    get : function(path) {
      let cb = staticRoutes[path]
      if (cb) {
        if (typeof cb === 'function') {
          cb.path = path
          return cb
        } else {
          return this.get(cb)
        }
      } else {
        for (var i = 0, l = dynamicRoutes.length; i < l; i++) {
          const layer = dynamicRoutes[i]
          const match = layer.re.exec(path)
          if (match) {
            const params = {}
            layer.keys.map((key, idx) => {
              let param = match[idx + 1]
              if (param) {
                param = decodeURIComponent(param)
                if (key.repeat) param = param.split(key.delimiter)
                params[key.name] = param
              }
            })
            const callback = (...args) => {
              const query = args.shift() || {}
              return layer.fn(Object.assign(query, params), ...args)
            }
            callback.path = layer.path
            return callback
          }
        }
      }
    },

    exec : function exec(path, ...args) {
      const cb = this.get(path)
      return cb && cb(...args)
    }
  }
}
