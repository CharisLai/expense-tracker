const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const app = express()
const port = 3000
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/new', (req, res) => {
    res.render('new')
})

app.get('/edit', (req, res) => {
    res.render('edit')
})
app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})