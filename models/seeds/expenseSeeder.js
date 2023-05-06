const mongoose = require('mongoose')
const Record = require('../record')
const record = require('../seeds/record.json').results
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
    console.log('MongoDB is Working!')
    Record.create(record)
        .then(() => {
            console.log('Seeder is Done.')
            db.close()
        })
        .catch(error => console.log(error))
})