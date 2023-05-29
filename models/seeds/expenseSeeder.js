const db = require('../../config/mongoose')
const Record = require('../record')
const record = require('../seeds/record.json').results
const mongoose = require('mongoose')

//mongodb connection status
db.once('open', async (req, res) => {
    try {
        console.log(record)
        const userId = mongoose.Types.ObjectId(record.id)
        const recordData = Object.assign({ userId }, record)
        console.log('MongoDB is Working!')
        await Record.create(recordData)
        console.log('Seeder is Done.')
        db.close()
    }
    catch (error) { console.log(error) }
})
