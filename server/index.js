const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const socketRoutes = require('./sockets')


io.on('connection', (socket) => socketRoutes(socket, io));

http.listen(3000)

app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))


// app.listen(3000, function () {
//     console.log('listening on *:3000');
// });