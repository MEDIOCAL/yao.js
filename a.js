const Router = require('./lib/router') 
const router = new Router()

router.get('/', function(req, res, next) {
	
	res.end('nihao');
})
router.get('/a', function(req, res, next) {
	console.log('a')
	res.end('hello, a')
})

module.exports = router