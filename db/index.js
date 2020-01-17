const client = require('./client.js');
const { getRandomNumber } = require('./helpers')
let db;
module.exports = {
    getCategories: async () => {
        try {
            !db ? db = await client.connect() : null;
            const categories = [];
            (await db.listCollections()
                .toArray()).forEach(({ name }) => 
                name !== "system.indices" ? categories.push(name) : null)
            return categories;
        } catch (err) { console.log(err) }
    },
    getRandomWord: async (category) => {
        try {
            !db ? db = await client.connect() : null;
            const count = await db.collection(category).countDocuments()
            const word = ((await db.collection(category).find()
                .toArray())[getRandomNumber(count)].word)
            return word;
        } catch (err) { console.log(err) }
    }
};