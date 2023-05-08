const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const totalCalculate = require('../../utils/totalCalculate')

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id
        const categories = await Category.find({}).lean()
        const findRecords = await Record.find({ userId }).lean()
            .populate('categoryId')
            .lean()

        let totalAmount = 0
        totalAmount = totalCalculate(findRecords)

        res.render('index', { records: findRecords, categories, totalAmount: totalAmount })

    } catch (error) {
        console.log(error)
    }
})

module.exports = router