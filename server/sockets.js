let games = {};
let users = {};

const { getCategories, getRandomWord } = require('../db')
const { getRandomNumber } = require('../db/helpers')

module.exports = (socket, io) => {

    const launchGame = async (id, room) => {
        games[room].state = "playing"
        if (games[room].drawer.current === null || games[room].drawer.current.id === id) {
            games[room].drawer.current = users[id]
            users[id].drawer = true
        }
        if (!games[room].word) {
            games[room].categories = await getCategories();
            games[room].state = "choosingCategory"
            io.in(room).emit('gameDetails', games[room])
        }
        else {
            io.in(room).emit('gameDetails', games[room]);
        }
    }

    const passToRandomDrawer = (room) => {
        console.log("pass to another drawer")
        console.log(JSON.stringify(games[room]))
        if (games[room]) {
            games[room].word = null;
            games[room].drawer.previous = { ...games[room].drawer.current }
            games[room].guesses = [];
            games[room].category = null;
            const userIDs = Object.keys(games[room].users)
            if (userIDs.length !== 0) {
                const nextDrawerID = userIDs[getRandomNumber(userIDs.length)]
                games[room].drawer.current = games[room].users[nextDrawerID];
            } else {
                games[room].drawer.current = null;
            }
            games[room].state = "choosingCategory"
            io.in(room).emit('gameDetails', games[room]);
        }
    }

    socket.on('createRoom', async (name) => {
        console.log("creating room")
        const room = Object.keys(games).length;
        users[socket.id] = { name, drawer: true, id: socket.id, room }
        games[room] = {
            room,
            drawer: { current: users[socket.id], previous: null },
            word: null,
            path: [],
            users: { [socket.id]: users[socket.id] },
            state: "choosingCategory",
            categories: await getCategories(),
            guesses: [],
            category: null
        }
        socket.join(room)
        io.in(room).emit('gameDetails', games[room]);
    })
    socket.on('joinRoom', ({ name, room }) => {
        console.log("joining: " + room)
        console.log(JSON.stringify(games[room]))
        if (games[room]) {
            users[socket.id] = { name, drawer: false, id: socket.id, room }
            games[room].users[socket.id] = users[socket.id]
            if (games[room].drawer.current === null) {
                console.log(room)
                passToRandomDrawer(room)
            }
            socket.join(room)
            io.in(room).emit('gameDetails', games[room]);
        } else {
            io.emit('notARoom')
        }
    })
    socket.on('chooseWord', async ({ category, room }) => {
        console.log(room)
        games[room].category = category;
        games[room].word = await getRandomWord(category)
        games[room].path = []
        games[room].state = "playing"
        io.in(room).emit('gameDetails', games[room]);
    })

    socket.on('addToPath', ({ room, point }) => {
        games[room].path = [...games[room].path, point];
        io.in(room).emit('updatedPath', games[room].path)
    })

    socket.on('clearDrawing', (room) => {
        games[room].path = [];
        io.in(room).emit('updatedPath', games[room].path)
    })

    socket.on('giveUp', (room) => {
        passToRandomDrawer(room)
    })

    socket.on('wrongGuess', ({ guess, room }) => {
        games[room].guesses.push({
            word: guess,
            name: users[socket.id].name,
            id: games[room].guesses.length
        })
        io.in(room).emit('gameDetails', games[room])
    })

    socket.on('endGame', (room) => {
        games[room].users[games[room].drawer.current.id].drawer = false;
        games[room] = {
            drawer: {
                previous: { ...games[room].drawer.current },
                current: users[socket.id]
            },
            word: null,
            path: [],
            state: "end",
            users: games[room].users,
            guesses: [],
            category: null,
            categories: games[room].categories,
            room
        }
        io.in(room).emit('gameDetails', games[room]);
    })

    socket.on('resetGame', (room) => {
        launchGame(socket.id, users[socket.id].room)
    })

    socket.on('disconnect', function () {
        console.log("disconnecting" + JSON.stringify(users[socket.id]))
        if (users[socket.id]) {
            const { room } = users[socket.id]
            delete users[socket.id]
            if (games[room]) {
                console.log(games[room])
                if (Object.keys(games[room].users).length < 2) {
                    console.log("last user leaving, deleting room")
                    delete games[room]
                } else {
                    delete games[room].users[socket.id]
                    if (games[room].drawer.current && games[room].drawer.current.id === socket.id) {
                        passToRandomDrawer(room)
                    }
                    io.in(room).emit('gameDetails', games[room]);
                }
            }
        }
    });
}