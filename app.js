const express = require('express')

const bcrypt = require('bcryptjs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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


app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})