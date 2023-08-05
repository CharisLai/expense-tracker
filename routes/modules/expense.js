const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

const { check, validationResult } = require('express-validator')

// Create - GET
router.get('/new', async (req, res) => {
    const categories = await Category.find({}).lean()
    res.render('new', { categories })
});
// Create - POST
router.post('/', [
    check('name')
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('必填，最多10字元！'),
    check('date')
        .isISO8601()
        .isAfter('2023-01-01')
        .isBefore('2023-12-12')
        .withMessage('日期未填或不在允許區間內'),
    check('amount')
        .trim()
        .isInt({ min: 1, max: 999999999 })
        .withMessage('最小數值1，最多九位數')
], async (req, res) => {
    // 檢查驗證結果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // 如果有錯誤，回傳錯誤訊息
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user._id
        const { name, date, categoryId, amount } = req.body
        await Record.create({ userId, name, date, categoryId, amount })
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500).send('伺服器錯誤')
    }
})

// Edit - GET
router.get('/:id/edit', async (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id
        const modifyRecord = await Record.findOne({ _id, userId }).lean().populate('categoryId')
        const categoryName = await modifyRecord.categoryId.name
        const categories = await Category.find({}).lean()
        modifyRecord.date = modifyRecord.date.toISOString().slice(0, 10)
        res.render('edit', { modifyRecord, categoryName, categories })
    } catch (error) {
        console.log(error)
    }
})
// Edit - PUT
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id

        let modifyRecord = await Record.findOne({ _id, userId })
        modifyRecord = Object.assign(modifyRecord, req.body)

        await modifyRecord.save()
        res.redirect('/')
    } catch (err) {
        console.log(error)
    }
})

// Delete - POST
router.delete('/:id', (req, res) => {
    try {
        const userId = req.user._id
        const _id = req.params.id
        return Record.findOneAndDelete({ _id, userId })
            .then(() => res.redirect('/'))
    } catch (error) {
        console.error(error)
    }
})

module.exports = router