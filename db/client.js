// docker run --name etch  -p 27018:27017 -v $PWD/data:/data/db -d mongo

const MongoClient = require('mongodb').MongoClient;
const url = process.env.NODE_ENV === "development" ?
    'mongodb://localhost:27017' :
    process.env.MONGODB_URI;
console.log("URL set to: " + url)
const dbName = 'etch';
const client = new MongoClient(url, { useUnifiedTopology: true });

module.exports = {
    connect: async () => {
        try {
            await client.connect()
            console.log("Connected successfully to server");
            return client.db(dbName);
        } catch (err) {
            console.log(err)
        }
    },
    disconnect: async () => {
        try {
            await client.close()
            console.log("Successfully disconnected");
        } catch (err) {
            console.log(err)
        }
    }
}

