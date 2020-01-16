const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { getRandomWord } = require('./helpers')

let game = {
    drawer: "",
    word: "",
    path: [],
    users: {},
    state: "playing"
}

io.on('connection', function (socket) {

    const launchGame = (id) => {
        game.state = "playing"
        if (game.drawer === "" || game.drawer === id) {
            game.drawer = id
            game.users[id].drawer = true
            getRandomWord()
                .then((word) => {
                    game.word = word
                    game.path = []
                    io.emit('gameDetails', game);
                })
        } else {
            io.emit('gameDetails', game);
        }
    }

    socket.on('registerUser', (name) => {
        game.users[socket.id] = { name, drawer: false }
        launchGame(socket.id)
    });

    socket.on('addToPath', (point) => {
        game.path = [...game.path, point];
        io.emit('updatedPath', game.path)
    })

    socket.on('endGame', () => {
        game.users[game.drawer].drawer = false;
        game = {
            drawer: socket.id,
            word: "",
            path: [],
            state: "end",
            users: game.users
        }
        io.emit('gameDetails', game);
    })

    socket.on('resetGame', () => {
        launchGame(socket.id)
    })

    socket.on('disconnect', function () {
        delete game.users[socket.id]
        if (game.drawer === socket.id) {
            game.drawer = "";
        }
        io.emit('gameDetails', game);
    });
});

http.listen(3000)

app.use(express.static('dist'))
app.get('/', (req, res) => res.render('index'))


// app.listen(3000, function () {
//     console.log('listening on *:3000');
// });