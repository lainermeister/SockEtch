const client = require('./client.js');
const fs = require("fs");

const getCategories = () => {
    return fs.readdirSync('./db/txtFiles/').map((file) => {
        return {
            category: file.split(".")[0],
            filename: file
        }
    })
}

(async () => {
    const db = await client.connect()
    const categories = getCategories();
    await Promise.all(categories.map(async ({ category, filename }) => {
        const collection = db.collection(category);
        const text = fs.readFileSync(`./db/txtFiles/${filename}`, "utf8")
        try {
            await Promise.all(text.split("\n").map(async (line) => {
                return await collection.insertOne({ word: line.toLowerCase() })
            }))
        } catch (err) { console.log(err) }
    }))
    await client.disconnect()
})()