const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
// Create - GET
router.get('/new', (req, res) => {
    res.render('new')
});
// Create - POST
router.post('/', async (req, res) => {
    try {
        const userId = req.user._id
        let { name, date, category, amount } = req.body
        amount = Number(amount)
        const findCategory = await Category.findOne({ name: category })
        const categoryId = findCategory._id

        await Record.create({
            name, date, amount, category, userId, categoryId
        })
        res.render('new')
    } catch (error) {
        console.log(error)
    }
});

// Edit - GET
router.get('/:id/edit', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    return Expense.findById({ _id, userId })
        .lean()
        .then(modify => res.render('edit', { modify }))
        .catch(error => console.log(error))
});
// Edit - PUT
router.put('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    Expense.findByIdAndUpdate({ _id, userId })
        .lean()
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
});

// Delete - POST
router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    Expense.findById({ _id, userId })
        .then(expense => expense.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
});

module.exports = router