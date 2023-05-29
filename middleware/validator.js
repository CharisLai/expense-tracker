const { body, validationResult } = require('express-validator')
const Category = require('../models/category')

const userValidator = [
    body('name')
        .trim()
        .not().isEmpty().withMessage('請輸入姓名')
        .bail()
        .isLength({ min: 2, max: 20 }).withMessage('請輸入兩個字元以上，最多20個字元')
    ,
    body('email')
        .isEmail()
        .bail()
        .isLength({ max: 32 })
    ,
    body('password').trim().isLength({ min: 6, max: 32 }).withMessage('請輸入至少6字元'),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('密碼與確認密碼 兩者不相符')
            }
            return true
        }),
    (req, res, next) => {
        const { name, email, password, confirmPassword } = req.body
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.render('register', {
                errors: result.array(),
                name, email, password, confirmPassword
            })
        }
        next()

    }
]

const recordValidator = [
    body('name')
        .trim()
        .not().isEmpty().withMessage('請輸入名稱')
        .bail()
        .isLength({ min: 2, max: 20 }).withMessage('請輸入兩個字元以上，最多20個字元'),

    body('date')
        .exists().withMessage('請輸入日期'),
    body('categoryId')
        .exists().withMessage('請選擇類別'),
    body('amount')
        .trim()
        .notEmpty().withMessage('請輸入金額')
        .isLength({ max: 10 }).withMessage('最多10字元'),

    async (req, res, next) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const categoryId = req.body.categoryId
            const categories = await Category.find({}).lean()
            const category = categories.find(category => {
                return category._id.toString() === categoryId
            })

            if (!req.params.id) {
                return res.render('new', {
                    errors: result.array(),
                    categories,
                    ...req.body,
                    categoryName: category.name
                })
            } else {
                const _id = req.params.id
                const recordData = Object.assign({ _id }, req.body)
                return res.render('edit', { errors: result.array(), findRecord: recordData, categories, categoryName: category.name })
            }
        }
        next()
    }
]
module.exports = { recordValidator, userValidator }