const Yao = require('./yao')
const Router = require('./router') 
const yao = new Yao()
const router = new Router()

const A = require('./a')

console.log(A)

router.use('/', A.routes())
router.use('/cxh', A.routes())

console.log(router)

yao.use(router.routes())

yao.use(function(req, res) {
	res.body = 'nihao'
})

yao.listen(8080)