let game = {
    drawer: { current: null, previous: null },
    word: null,
    path: [],
    users: {},
    state: "playing",
    categories: []
}

const { getCategories, getRandomWord } = require('../db')
const { getRandomNumber } = require('../db/helpers')

module.exports = (socket, io) => {

    const launchGame = async (id) => {
        game.state = "playing"
        if (game.drawer.current === null || game.drawer.current.id === id) {
            game.drawer.current = { ...game.users[id] }
            game.users[id].drawer = true
        }
        if (!game.word) {
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
        game.word = await getRandomWord(category)
        game.path = []
        game.state = "playing"
        io.emit('gameDetails', game);
    })

    socket.on('addToPath', (point) => {
        game.path = [...game.path, point];
        io.emit('updatedPath', game.path)
    })

    socket.on('endGame', () => {
        game.users[game.drawer.current.id].drawer = false;
        game = {
            drawer: {
                previous: { ...game.drawer.current },
                current: { ...game.users[socket.id] }
            },
            word: null,
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
        console.log("disconnected")
        delete game.users[socket.id]
        if (game.drawer.current && game.drawer.current.id === socket.id) {
            game.word = null;
            game.drawer.previous = { ...game.drawer.current }
            const userIDs = Object.keys(game.users)
            if (userIDs.length !== 0) {
                const nextDrawerID = userIDs[getRandomNumber(userIDs.length)]
                game.drawer.current = { ...game.users[nextDrawerID] };
            } else {
                game.drawer.current = null;
            }
            game.state = "choosingCategory"
        }
        io.emit('gameDetails', game);
    });
}