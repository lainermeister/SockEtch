const axios = require('axios')
const alphabet = 'abcdefghijklmnopqrstuvwy'

const getRandomNumber = (n) => Math.floor(n * Math.random())

module.exports = {
    getRandomWord: () => {
        const startChar = alphabet[getRandomNumber(alphabet.length)]
        return axios.get(`https://api.datamuse.com/words?sp=${startChar}*&md=psf`)
            .then(({ data }) => {
                let randomWord = data[getRandomNumber(data.length)]
                while (!randomWord.tags.includes("n")) {
                    randomWord = data[getRandomNumber(data.length)]
                }
                return randomWord.word.toLowerCase();
            })
    }
}