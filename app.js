const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const routes = require('./routes')
const app = express()
const port = 3000


mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})
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


app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})