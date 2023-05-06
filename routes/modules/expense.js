const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

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

router.post('/new', (req, res) => {
    res.render('new')
});

// router.post('/edit', (req, res) => {
//     Expense.create(req.body)
//         .then(() => res.redirect('/'))
//         .catch(error => console.log(error))
//     console.log(req.body)
// });



module.exports = router