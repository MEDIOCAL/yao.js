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
			return fn(req, res).then().catch(that.onerror)
		}
	}
	
	use(fn) {
		this.middleware.push(fn)
	}

	onerror(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        let msg = err.message || 'Internal error';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }
}

module.exports = Yao