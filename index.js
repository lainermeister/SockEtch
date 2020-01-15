var express = require('express');
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

app.listen(3000, function () {
    console.log('listening on *:3000');
});