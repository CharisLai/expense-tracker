const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')
require('./config/mongoose')
const usePassport = require('./config/passport')
const helpers = require('./helper/handlebars-helper')
const app = express()
const PORT = process.env.PORT || 3000


//express-handlebars
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main', extname: '.hbs', helpers
}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
// express-session
app.use(session({
    secret: 'What is this?',
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// Passport
usePassport(app)
// flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    res.locals.fail_msg = req.flash('fail_msg')
    res.locals.errors = req.flash('errors')
    next()
})

// router
app.use(routes)

app.get('/test', (req, res) => {
    res.json({
        message: 'test work!'
    })
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})
