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

	routes() {
		const that = this
		const dispatch = (req, res, next) => {
			const path = req.url
			console.log(that)
		}
		dispatch.router = this	
		return dispatch
	}

	use() {
		let path = null
		const router = this
		const middleware = Array.prototype.slice.call(arguments)
		const hasPath = typeof middleware[0] === 'string'

		if(hasPath) {
			path = middleware.shift()
		}

		middleware.forEach( (m) => {
			if(m.router) {
				for(let layer of m.router.stack) {
					router.stack.push(layer)
				}
			} else {
				const router = router 
			    const stack = router.stack
			    const route = new Layer(path, [method], middleware)
			    stack.push(route)
			}
		})
	}
}

module.exports = Router