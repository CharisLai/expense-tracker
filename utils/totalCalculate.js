module.exports = function (mapRecord) {
    return mapRecord.reduce(
        (acc, cur) => acc + cur.amount, 0
    )
}