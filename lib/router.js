const compose = require('./compose')
class Layer {
	constructor(path, methods, middleware) {
		this.stack = Array.isArray(middleware) ? middleware : [middleware]
		this.methods = []
		this.setMethods(methods)
		this.path = path
		this.pathName = path.replace(/\//,'')
	}
	setMethods(methods) {
		methods.forEach((method) => {
			this.methods.push(method.toUpperCase())
		})
	}

	setPrefix(path) {
		path = path.replace(/\//,'')
		if (this.path) {
		    this.path = `/${path}/${this.pathName}`
		    this.paramNames = []
		}
		return this
	}

	match(path) {
		if(path.indexOf("?") >= 0) {
			path = path.substring(0, path.indexOf("?"))
		}
		return this.path === path
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
		const router = this
		const dispatch = (req, res, next) => {
			const path = req.url
			const matched = router.match(path, req.method)
			if(!matched.route) return next()
			
			let middleware = []
			const pathAndMethod = matched.pathAndMethod
			
			for(let layer of pathAndMethod) {
				// middleware = middleware.concat(layer.stack)
				middleware = [...middleware, ...layer.stack] 
			}
			console.log(middleware)

			const fn = compose(middleware)

			return Promise.resolve(fn(req, res, next))
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
					if(path) {
						layer.setPrefix(path)
					}
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

	match(path, method) {
		const stack = this.stack
		
		let pathAndMethod = []
		let paths = []
		let route = false

		for(let layer of stack) {
			if(layer.match(path)) {
				paths.push(layer)
				if(layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
					pathAndMethod.push(layer)
					if(layer.methods.length) {
						route = true
					}
				}
			}
		}

		return {
			pathAndMethod,
			paths,
			route
		}
	}
}

module.exports = Router