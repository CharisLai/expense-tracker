const express = require('express')

const bcrypt = require('bcryptjs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
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
app.use(express.static('public'))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)
// express-session
app.use(session({
    secret: 'What is this?',
    resave: false,
    saveUninitialized: true
}))

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})