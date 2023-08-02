const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const userSeed = require('../data/user.json').results
const recordSeed = require('../data/record.json').results


db.once('open', async () => {
    try {
        // 從database取出cateogry資料
        const categoryList = await Category.find().lean()
        return Promise.all(
            // 對user seed資料進行處理
            userSeed.map(async (user) => {
                try {

                    const salt = await bcrypt.genSalt(10)
                    const hash = await bcrypt.hash(user.password, salt)
                    user.password = hash
                    const userData = await User.create({ ...user })
                    console.log(`user ${userData.name} created!`)

                    // 處理user記錄
                    const userIndex = user.index
                    // user.index record使用紀錄
                    const userRecords = userIndex.map(index => {

                        const record = recordSeed[index]
                        console.log(recordSeed)
                        record.userId = userData.id
                        // category的name = record的category 
                        const categoryId = categoryList.find(data => {
                            return data.name === record.category
                        })
                        // 依照上行關係調出對應的id
                        record.categoryId = categoryId
                        return record
                    })
                    await Record.create(userRecords)
                }
                catch (err) {
                    console.log(err)
                }
            })
        )
            .then(() => {
                console.log('Seed user and records have been created.')
                process.exit()
            })
    }
    catch (error) { console.log(error) }
})