const express = require('express')
const router = express.Router()
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


router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: 'All fields are required！' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: 'Password and confirmation password do not match！' })
    }
    if (errors.length) {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    }

    User.findOne({ email }).then(user => {
        if (user) {
            errors.push({ message: 'This Email registered' })
            res.render('register', {
                errors,
                name,
                email,
                password,
                confirmPassword
            })
        } return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => User.create({
                name, email, password: hash
            }))
            .then(() => res.redirect('/'))
            .catch(error => console.error(error))
    })
})
// Logout
router.get('/logout', (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        req.flash('success_msg', 'You have successfully logged out')
        res.redirect('/users/login')
    })
})
module.exports = router