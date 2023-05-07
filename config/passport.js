const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
    // Passport model Initialization
    app.use(passport.initialize())
    app.use(passport.session())
    // Login Strategic
    passport.use(new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash('fail_msg', 'That email is not registered!'))
                    }
                    return bcrypt.compare(password, user.password).then(isMatch => {
                        if (!isMatch) {
                            return done(null, false, req.flash('fail_msg', 'Email or Password incorrect.'))
                        }
                        return done(null, user)
                    })
                })
                .catch(error => done(error, false))
        }))

    // serialize/ deserialize
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(error => done(error, null))
    })
}