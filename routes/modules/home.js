const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
    const userId = req.user._id
    try {
        let totalAmount = 0
        const findRecords = await Record.find({ userId })
            .sort({ date: 'desc' })
            .populate('categoryId')
            .lean()

        let categoriesSet = new Set() // 使用 Set 儲存唯一的類別
        const records = findRecords.map((record) => {
            totalAmount += record.amount
            record.date = record.date.toISOString().slice(0, 10)
            categoriesSet.add(record.categoryId) // 將類別加入 Set 中
            return record
        })

        const categories = await Category.find({ _id: { $in: Array.from(categoriesSet) } }) // 將 Set 轉換回陣列
            .lean()
            .sort({ _id: 'asc' })

        res.render('index', { records, categories, totalAmount })
    } catch (error) {
        console.log(error)
    }
})

router.post('/', (req, res) => {
    const userId = req.user._id
    const { categoryId } = req.body
    if (categoryId === 'all') {
        return res.redirect('/')
    }
    return Category.find()
        .lean()
        .then((categories) => {
            return Record.find({ userId, categoryId })
                .populate('categoryId')
                .lean()
                .sort({ date: 'desc' })
                .then((records) => {
                    let totalAmount = 0
                    records.forEach((record) => {
                        totalAmount += record.amount
                        record.date = record.date.toISOString().slice(0, 10)
                    })
                    return res.render('index', { records, categories, totalAmount })
                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
})

module.exports = router