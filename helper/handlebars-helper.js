const dayjs = require('dayjs')

module.exports = {
    match: function (a, b) {
        if (a === b) {
            return 'selected'
        }
    },
    dateFormat: function (date) {
        return dayjs(date).format('YYYY-MM-DD')
    }
}

