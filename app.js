const express = require('express')

const bcrypt = require('bcryptjs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')

require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000



//express-handlebars
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main', extname: '.hbs', helpers: {
        match: (a, b) => a === b,
    },
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

app.use((req, res, next) => {
    console.log(req.user)
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    next()
})

app.use(routes)


app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})