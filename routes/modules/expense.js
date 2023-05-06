const express = require('express')
const router = express.Router()
const Expense = require('../../models/record')

// Create - GET
router.get('/new', (req, res) => {
    res.render('new')
});
// Create - POST
router.post('/', (req, res) => {
    console.log(req.body)
    return Expense.create({ ...req.body })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
});

// Edit - GET
router.get('/:id/edit', (req, res) => {
    const _id = req.params.id
    return Expense.findById(_id)
        .lean()
        .then(modify => res.render('edit', { modify }))
        .catch(error => console.log(error))
});
// Edit - PUT
router.put('/:id', (req, res) => {
    const _id = req.params.id
    Expense.findByIdAndUpdate(_id, req.body)
        .lean()
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
});

// Edit - POST
router.delete('/:id', (req, res) => {
    const _id = req.params.id
    Expense.findById(_id)
        .then(expense => expense.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
});

module.exports = router