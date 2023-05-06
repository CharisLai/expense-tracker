const express = require('express')
const router = express.Router()
const data = require('../../models/seeds/record.json')
const Expense = require('../../models/expense')

router.get('/', (req, res) => {
    //取得所有資料
    // res.render('index', { data: data.results })
    Expense.find()
        .lean()
        .then(data => res.render('index', { data }))
        .catch(error => console.log(error))

})

module.exports = router