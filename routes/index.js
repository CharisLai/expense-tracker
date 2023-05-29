const router = require('express').Router()
const home = require('./modules/home')
const expense = require('./modules/expense')
const user = require('./modules/user')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')


router.use('/expense', authenticator, expense)
router.use('/user', user)
router.use('/auth', auth)
router.use('/', authenticator, home)
module.exports = router