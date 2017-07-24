
/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function () {
  const routes = {}
  return {
    get : (path, cb) => {
      if (cb) {
        routes['get']= cb
      } else {
        return routes['get']()
      }
    }
  }
}
