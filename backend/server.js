
//using older version of socket.io
const io = require('socket.io')(8900, {
    cors: {
        origin:"http://127.0.0.1:5500",
        credentials: true,
      }
})

const {createGameState, initGame} = require('./game')
const {FRAME_RATE} = require('./constants')
const {gameLoop} = require('./game')
const {getUpdatedVeolicty} = require('./game')
const {makeid} = require('./utils')
const state = {}
const clientRooms = {}

io.on('connection', client => {
    startGameInterval(client,state)
    client.emit('init', {data: 'hello world'})

    client.on('keydown', handleKeydown)
    client.on('newGame', handleNewGame)
    client.on('joinGame', handleJoinGame)

    function handleJoinGame(gameCode) {
        const room = io.sockets.adapter.rooms[gameCode]
        let allUsers
        if (room) {
            allUsers = room.sockets
        }

        let numClients = 0
        if (allUsers) {
            numClients = Object.keys(allUsers).length
        }

        if (numClients === 0) {
            client.emit('unknownGame')
            return
        }
        else if (numClients > 1) {
            client.emit('tooManyPlayers')
            return
        }
        
        clientRooms[client.id] = gameCode

        client.join(gameCode)
        client.number = 2
        client.emit('init', 2)

        startGameInterval(gameCode)
    }

    function handleNewGame() {
        // generate code for room 
        let roomName = makeid(5)
        clientRooms[client.id] = roomName
        //send back game code
        client.emit('gameCode', roomName)
         state[roomName] = initGame()
        //  add playerOne to room
         client.join(roomName)
         client.number = 1
         client.emit('init', 1)

    }


    function handleKeydown(keyCode) {
        const roomName =  clientRooms[client.id]

        if (!roomName) {
            return
        }
        try {
            keyCode = parseInt(keyCode)
        }
        catch (err) {
            console.log(err)
            return
        }

        const vel = getUpdatedVeolicty(keyCode)
        console.log(keyCode, 'KEYCODE')

        if (vel) {
            state[roomName].players[client.number - 1].vel = vel
        }
    }
})



function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName])
        if (!winner) {
            emitGameState(roomName, state[roomName])
            
        }
        else{
            emitGameOver(roomName, winner)
            state[roomName] = null
            clearInterval(intervalId)
        }
    }, 1000 / FRAME_RATE)
}

function emitGameState(roomName, state) {
    io.sockets.in(roomName)
    .emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner) {
    io.sockets.in(roomName)
    .emit('gameOver', JSON.stringify({ winner }))
} 

io.listen(3000)