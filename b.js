const Router = require('./lib/router') 
const router = new Router()

router.get('/', function(req, res, next) {
	res.body = '///'
})
router.get('/b', function(req, res, next) {
	console.log('b')
	res.end('hello, b')
})

module.exports = router