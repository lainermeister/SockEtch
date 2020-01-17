// docker run --name etch  -p 27018:27017 -v $PWD/data:/data/db -d mongo

const MongoClient = require('mongodb').MongoClient;
const url = process.env.NODE_ENV === "development" ?
    'mongodb://mongo:27017' :
    'mongodb://heroku_9nm9b5rt:d7j4faf38vrm6b4khr70412d63@ds263928.mlab.com:63928/heroku_9nm9b5rt';
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

