const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { recordValidator } = require('../../middleware/validator')

// Create - GET
router.get('/new', async (req, res) => {
    const categories = await Category.find({}).lean()
    res.render('new', { categories })
});
// Create - POST
router.post('/', async (req, res) => {
    try {
        const userId = req.user._id
        const recordData = Object.assign({ userId }, req.body)

        await Record.create(recordData)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

// Edit - GET
router.get('/:id/edit', async (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id
        const modifyRecord = await Record.findOne({ _id, userId }).populate('categoryId').lean()
        const categoryName = await modifyRecord.categoryId.name
        const categories = await Category.find({}).lean()
        res.render('edit', { modifyRecord, categoryName, categories })
    } catch (error) {
        console.log(error)
    }
})
// Edit - PUT
router.put('/:id', recordValidator, async (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id

        let modifyRecord = await Record.findOne({ _id, userId })
        modifyRecord = Object.assign(modifyRecord, req.body)

        await modifyRecord.save()
        req.flash
        res.redirect('/')
    } catch (err) {
        console.log(error)
    }
})

// Delete - POST
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id
        const record = await Record.findOne({ _id, userId })
        await record.remove()
        res.redirect('/')
    } catch (error) {
        console.error(error)
    }
})

module.exports = router