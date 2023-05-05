const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')

router.get('/', (req, res) => {
    //取得所有資料
    Expense.find()
        .lean()
        .then(data => res.render('index', { data }))
        .catch(error => console.log(error))

})

module.exports = router