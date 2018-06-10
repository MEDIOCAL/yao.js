const http = require('http')
const compose = require('./compose')

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