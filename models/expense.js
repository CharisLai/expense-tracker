const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expenseSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    categoryId: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model('Expense', expenseSchema)