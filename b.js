const Router = require('./lib/router') 
const router = new Router()

router.get('/', function(req, res, next) {
	res.write('<h1>Hello,world!</h1>');
	res.write('<p>这是我们的第一个http服务器</p>')
	res.end()
})
router.get('/b', function(req, res, next) {
	console.log('b')
	res.end('hello, b')
})

module.exports = router