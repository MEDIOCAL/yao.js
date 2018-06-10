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

class Layer {
	constructor(path, methods, middleware) {
		this.stack = Array.isArray(middleware) ? middleware : [middleware]
		this.methods = []
		this.setMethods(methods)
		this.path = path
	}
	setMethods(methods) {
		methods.forEach((method) => {
			this.methods.push(method.toUpperCase())
		})
	}
}

class Router {
	constructor() {
		this.stack = []
		this.methods = ['get', 'post', 'put']
		this.params = {}
		this.setMethods()
	}

	setMethods() {
		const methods = this.methods 
		methods.forEach( (method) => {
			Router.prototype[method] = function(name, path, middleware) {
				if (typeof path === 'string' || path instanceof RegExp) {
			      middleware = Array.prototype.slice.call(arguments, 2);
			    } else {
			      middleware = Array.prototype.slice.call(arguments, 1);
			      path = name
			      name = null
			    }

			    const router = this 
			    const stack = this.stack

			    const route = new Layer(path, [method], middleware)

			    stack.push(route)
			}
		})
	}

	// use() {
	// 	let path = '/'
	// 	const router = this
	// 	const middleware = Array.prototype.slice.call(arguments)
	// 	const hasPath = typeof middleware[0] === 'string'

	// 	if(hasPath) {
	// 		path = middleware.shift()
	// 	}

	// 	middleware.forEach()
	// }
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

const yao = new Yao()
const router = new Router()


yao.use(function(req, res) {
	res.body = 'nihao'
})


yao.listen(8080)