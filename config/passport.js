const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = (app) => {
    // Passport model Initialization
    app.use(passport.initialize())
    app.use(passport.session())

    // Login Strategic
    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passReqToCallback: true },
            async (req, email, password, done) => {
                try {
                    const user = await User.findOne({ email })
                    if (!user) {
                        return done(
                            null,
                            false,
                            req.flash('fail_msg', 'That email is not registered!')
                        )
                    }

                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) {
                        return done(
                            null,
                            false,
                            req.flash('fail_msg', 'Email or Password incorrect.')
                        )
                    }

                    return done(null, user)
                } catch (error) {
                    return done(error, false)
                }
            }
        )
    )

    // Facebook Strategy
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_ID,
                clientSecret: process.env.FACEBOOK_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK,
                profileFields: ['email', 'displayName'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const { name, email } = profile._json
                    const user = await User.findOne({ email })

                    if (user) {
                        return done(null, user)
                    }

                    const randomPassword = Math.random().toString(36).slice(-8)
                    const salt = await bcrypt.genSalt(10)
                    const hash = await bcrypt.hash(randomPassword, salt)

                    const newUser = await User.create({
                        name,
                        email,
                        password: hash,
                    })

                    return done(null, newUser)
                } catch (error) {
                    return done(error, false)
                }
            }
        )
    )

    // serialize/ deserialize
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).lean()
            if (user) {
                return done(null, user)
            } else {
                return done(new Error('Can not find User'), null)
            }
        } catch (error) {
            return done(error, null)
        }
    })
}
