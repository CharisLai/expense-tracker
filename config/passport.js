const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
                    // 確認email
                    if (!user) {
                        return done(null, false, req.flash('fail_msg', 'That email is not registered!'))
                    }
                    return bcrypt.compare(password, user.password)
                        // 檢查密碼與email
                        .then(isMatch => {
                            if (!isMatch) {
                                return done(null, false, req.flash('fail_msg', 'Email or Password incorrect.'))
                            }
                            return done(null, user)
                        })
                })
                .catch(error => done(error, false))
        }))

    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { name, email } = profile._json
                const userEmail = await User.findOne({ email })
                if (userEmail) {
                    return done(null, userEmail)
                }
                const randomPassword = Math.random().toString(36)
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(randomPassword, salt)
                const user = await User.create({ name, email, password: hash })
                return done(null, user)
            }
            catch (error) {
                return done(error, false)
            }
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