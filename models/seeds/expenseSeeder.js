const db = require('../../config/mongoose')
const Record = require('../record')
const record = require('../seeds/record.json').results

//mongodb connection status
db.once('open', () => {
    console.log('MongoDB is Working!')
    Record.create(record)
        .then(() => {
            console.log('Seeder is Done.')
            db.close()
        })
        .catch(error => console.log(error))
})