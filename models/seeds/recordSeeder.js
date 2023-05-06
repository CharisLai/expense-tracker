const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const userSeed = require('./user.json').results
const recordSeed = require('./record.json').results
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
db.once('open', async () => {
    try {
        console.log('MongoDB is working.')
        // record中的 CategoryId 轉換為 MongoDB_id
        const categoryList = await Category.find().lean()
        recordSeed.forEach(item => {
            item.categoryId = categoryList.find(element => element.name === item.categoryId)
        })
        // Create User
        await Promise.all(
            userSeed.map(async (user, userIndex) => {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(user.password, salt)
                const userData = await User.create({
                    name: user.name,
                    email: user.email,
                    password: hash
                })
                // Create Record
                const userRecord = []
                recordSeed.forEach((record, recordIndex) => {
                    if (Math.floor(recordIndex / 3) === userIndex) {
                        record.userId = userData._id
                        userRecord.push(record)
                    }
                })
                await Record.create(userRecord)
            }))
        console.log('Seed user and records have been created.')
        process.exit()
    }
    catch (error) { console.log(error) }
})