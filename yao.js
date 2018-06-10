const http = require('http')

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (req, res, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(req, res, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

class Yao {
	constructor() {
		this.middleware = []
	}

	listen(port) {
		const server = http.createServer(this.callback())
		server.listen(port)
		return server
	}

	callback() {
		const that = this
		return function(req, res) {
			const fn = compose(that.middleware)
			fn(req, res)
		}
	}

	use(fn) {
		this.middleware.push(fn)
	}
}

module.exports = Yao