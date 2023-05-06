const mongoose = require('mongoose')
const Category = require('../category')
const categoryList = require('./category.json').results
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// connect MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

//mongodb connection status
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    Category.create(categoryList)
        .then(() => {
            console.log('Categories have been created.')
            db.close()
        })
        .catch(error => console.error(error))
})