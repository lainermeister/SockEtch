let game = {
    drawer: null,
    word: "",
    path: [],
    users: {},
    state: "playing",
    categories: []
}

const { getCategories, getRandomWord } = require('../db')

module.exports = (socket, io) => {

    const launchGame = async (id) => {
        game.state = "playing"
        if (game.drawer === null || game.drawer.id === id) {
            game.drawer = game.users[id]
            game.users[id].drawer = true
        }
        if (game.word === "") {
            game.categories = await getCategories();
            game.state = "choosingCategory"
            io.emit('gameDetails', game)

        }
        else {
            io.emit('gameDetails', game);
        }
    }

    socket.on('registerUser', (name) => {
        game.users[socket.id] = { name, drawer: false, id: socket.id }
        launchGame(socket.id)
    });

    socket.on('chooseWord', async (category) => {
        game.word = await getRandomWord('food')
        game.path = []
        io.emit('gameDetails', game);
    })

    socket.on('addToPath', (point) => {
        game.path = [...game.path, point];
        io.emit('updatedPath', game.path)
    })

    socket.on('endGame', () => {
        game.users[game.drawer].drawer = false;
        game = {
            drawer: game.users[socket.id],
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
        if (game.drawer && game.drawer.id === socket.id) {
            game.drawer = null;
        }
        io.emit('gameDetails', game);
    });
}