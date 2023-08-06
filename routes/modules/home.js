const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/', async (req, res) => {
    try {
        // 使用者Id
        const userId = req.user._id
        // 總額歸零
        let totalAmount = 0
        // 找出符合userId的所有記錄
        let Records = await Record.find({ userId })
            .lean()
            .sort({ date: 'desc' })
            .populate('categoryId') // icon

        // cate for selector
        const categories = await Category.find({}).lean()

        const records = Records.map((record) => {
            totalAmount += record.amount
            record.date = record.date.toISOString().slice(0, 10)
            return record
        })

        res.render('index', { records, categories, totalAmount })

    } catch (error) {
        console.log(error)
    }
})

router.get('/filter', async (req, res) => {

    try {
        // 使用者Id
        const userId = req.user._id
        // 總額歸零
        let totalAmount = 0
        // cate for selector
        const categories = await Category.find({}).lean()
        // filter
        let selectedCategory = req.query.category
        // 查找category
        const categoryId = await Category.findOne({ _id: selectedCategory }).lean()
        // 依照userId cate查找record
        const record = await Record.find({ userId, categoryId }).lean().populate('categoryId')
        if (selectedCategory) {
            const data = await Promise.all(record.map(async record => {

                // 計算額度
                totalAmount += record.amount
                return {
                    ...record,
                    date: record.date.toISOString().slice(0, 10)
                }
            }))
            res.render('index', { records: data, categories, totalAmount })
        } else {
            res.render('index', { records, categories, totalAmount })
        }


    } catch (err) {
        console.log(err)
    }
})

module.exports = router