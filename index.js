const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let numUsers = 0;
app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('registerUser', () => {
        const userID = ++numUsers;
        console.log('new user is registered :', userID);
        socket.emit('newUserDetails', userID);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000)
// app.listen(3000, function () {
//     console.log('listening on *:3000');
// });