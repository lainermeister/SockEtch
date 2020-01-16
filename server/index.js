const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let numUsers = 0;
const { getRandomWord } = require('./helpers')
let word = "";
let path = [];

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('registerUser', () => {
        const userID = ++numUsers;
        console.log('new user is registered :', userID);
        if (userID === 1) {
            getRandomWord()
                .then((word) => {
                    word = word
                    socket.emit('newUserDetails', { userID, word });
                })
        }
    });

    socket.on('updatePath', (path) => {
        path = path;
        io.emit('updatedPath', path)
    })

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000)

app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))


// app.listen(3000, function () {
//     console.log('listening on *:3000');
// });