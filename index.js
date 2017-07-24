
/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function () {
  const routes = {}
  return {
    alias: () => {},
    routes: () => {},
    get : (path, cb) => {
      if (cb) {
        routes['get']= cb
      } else {
        return routes['get']()
      }
    }
  }
}
