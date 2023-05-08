const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
// const filter = require('../modules')
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