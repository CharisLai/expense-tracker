const db = require('../../config/mongoose')
const Category = require('../category')
const category = [
    { name: "家居物業", icon: "fa-solid fa-house" },
    { name: "交通出行", icon: "fa-solid fa-van-shuttle" },
    { name: "休閒娛樂", icon: "fa-solid fa-face-grin-beam" },
    { name: "餐飲食品", icon: "fa-solid fa-utensils" },
    { name: "其他", icon: "fa-solid fa-pen" },
]

//mongodb connection status
db.once('open', () => {
    Category.create(category)
        .then(() => {
            console.log('Categories have been created.')
            db.close()
        })
        .catch(error => console.error(error))
})