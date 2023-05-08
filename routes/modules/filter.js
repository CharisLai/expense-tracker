const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const ObjectId = require('bson-objectid')

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id
        const { categoryId } = req.query
        if (!categoryId) return res.redirect('/')

        const categories = await Category.find({}).lean()
        const category = categories.find(category => {
            return category._id.toString() === categoryId
        })

        const findRecord = await Record.find({ userId, categoryId })
            .populate('categoryId')
            .lean()

        let totalAmount = 0
        if (findRecord.length) {
            const result = await Record.aggregate([
                {
                    $match: {
                        $and: [
                            { userId }, { categoryId: ObjectId(categoryId) }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null, total: { $sum: '$amount' }
                    }
                },
            ])
            totalAmount = result[0].total
        }
        res.render('index', { records: findRecord, totalAmount, categories, categoryName: category.name })
    } catch (error) {
        console.log(error)
    }
})
module.exports = router