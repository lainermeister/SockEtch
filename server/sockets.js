let game = {
    drawer: "",
    word: "",
    path: [],
    users: {},
    state: "playing"
}

const { getRandomWord } = require('./helpers')

module.exports = (socket, io) => {

    const launchGame = (id) => {
        game.state = "playing"
        if (game.drawer === "" || game.drawer === id) {
            game.drawer = id
            game.users[id].drawer = true
        }
        if (game.word === "") {
            getRandomWord()
                .then((word) => {
                    game.word = word
                    game.path = []
                    io.emit('gameDetails', game);
                })
        }
        else {
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
}