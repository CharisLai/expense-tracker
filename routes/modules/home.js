const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id
        const categories = await Category.find({}).lean()
        const findRecords = await Record.find({ userId }).lean()
            .populate('categoryId')
            .lean()

        const totalAmount = await Record.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        // console.log(totalAmount)
        res.render('index', { records: findRecords, categories, totalAmount: totalAmount[0].total })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router