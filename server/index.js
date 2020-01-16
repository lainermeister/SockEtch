const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { getRandomWord } = require('./helpers')

const game = {
    drawer: "",
    word: "",
    path: [],
    users: []
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('registerUser', (name) => {
        console.log("my id: " + socket.id)
        game.users.push({ name, id: socket.id })
        if (game.drawer === "") {
            game.drawer = socket.id
            getRandomWord()
                .then((word) => {
                    game.word = word
                    console.log(JSON.stringify(game))
                    socket.emit('newUserDetails', game);
                })
        } else {
            console.log(JSON.stringify(game))
            socket.emit('newUserDetails', game);
            socket.emit('updatedPath', game.path)
        }

    });

    socket.on('updatePath', (path) => {
        game.path = path;
        io.emit('updatedPath', path)
    })

    socket.on('disconnect', function () {
        console.log('user disconnected');
        if (game.drawer === socket.id) {
            game.drawer = "";
        }
    });
});

http.listen(3000)

app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))


// app.listen(3000, function () {
//     console.log('listening on *:3000');
// });