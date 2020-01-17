const axios = require('axios')
const alphabet = 'abcdefghijklmnopqrstuvwy'

module.exports.getRandomNumber = (n) => Math.floor(n * Math.random())

module.exports.getRandomString = (n) =>
    Array(n).fill(null).map(() =>
        alphabet[module.exports.getRandomNumber(alphabet.length)]
    ).join("")

