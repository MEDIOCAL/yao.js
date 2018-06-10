const Router = require('./router') 
const router = new Router()

router.get('/', function(req, res, next) {
	res.body = '///'
})
router.get('/a', function(req, res, next) {
	res.body = '/a'
})

module.exports = router