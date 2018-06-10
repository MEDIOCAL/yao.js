const Yao = require('./lib/yao')
const Router = require('./lib/router') 
const yao = new Yao()
const router = new Router()

const A = require('./a')
const B = require('./b')

router.use('/', A.routes())
router.use('/cxh', B.routes())

console.log(router)

yao.use(router.routes())

yao.use(function(req, res) {
	res.body = 'nihao'
})

yao.listen(8080)