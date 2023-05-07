const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')


router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login'
}))


router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ email }).then(user => {
        if (user) {
            console.log('User already exists.')
            res.render('register', {
                name,
                email,
                password,
                confirmPassword
            })
        } else {
            return User.create({
                name,
                email,
                password
            })
                .then(() => res.redirect('/'))
                .catch(error => console.error(error))
        }
    })
        .catch(error => console.log(error))
})

// Logout
router.get('/logout', (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        res.redirect('/user/login')
    })
})
module.exports = router