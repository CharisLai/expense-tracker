const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')


// Login
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        req.flash('fail_msg', 'All fields are required！')
    }
    next()
},
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureMessage: true
    }))

// register
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (password !== confirmPassword) {
        errors.push({ message: 'Password and confirmation password do not match！' })
    }
    if (errors.length) {
        return res.redirect('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    }
    const user = await User.findOne({ email })
    if (user) {
        errors.push({ message: 'This Email registered' })
        return res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const createUser = await User.create({
            name, email, password: hash
        })
        req.logIn(createUser, (error) => {
            if (error) return next(error)
            res.redirect('/')
        })
    } catch (error) {
        console.error(error)
    }
})
// Logout
router.get('/logout', (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        req.flash('success_msg', 'You have successfully logged out')
        res.redirect('/user/login')
    })
})
module.exports = router