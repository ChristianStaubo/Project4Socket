require('dotenv').config()
//using older version of socket.io
const io = require('socket.io')(process.env.HOST || 8900, {
    cors: {
        // origin:"http://127.0.0.1:5500",
            origin:`*`,
        // credentials: true,
      }
})

const {createGameState, initGame, count} = require('./game')
const {singlePlayercreateGameState, singlePlayergameLoop} = require('./game')
const {gameLoop} = require('./game')
const {getUpdatedVeolicty} = require('./game')
const {makeid} = require('./utils')
// const e = require('cors')
const {FRAME_RATE, GRIDE_SIZE} = require('./constants')

let state = {}
const clientRooms = {}

let singlePlayer = true
let scoreCount = 0
//this runs when a client connects
io.on('connection', client => {
    client.on('singlePlayer', handleSinglePlayer)

    function handleSinglePlayer(trueOrFalse) {
        singlePlayer = trueOrFalse
        console.log('singplayer is', singlePlayer)
    }
    if (singlePlayer !== true) {
    startGameInterval(client,state)
    // client.emit('init', {data: 'hello world'})
    
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
            console.log(room)
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


    function handleKeydown(keyCode, gameActive) {
        const roomName =  clientRooms[client.id]
        console.log(clientRooms)
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

        if (vel && gameActive === true) {
            state[roomName].players[client.number - 1].vel = vel
        }
    }
}

else if (singlePlayer === true) {
    //client.emit sends second argument to client when it listens for init event
    client.emit('connection')
    client.emit('init', {data: 'Sending this data'})
    //set state when client connects
    state = singlePlayercreateGameState()
    client.on('increment', handleIncrement)
    client.on('keydown', handleKeydown)

    function handleIncrement(scoreCount) {
        scoreCount = scoreCount
        console.log('The current score is', scoreCount)
    }
    //set tick with frame rate using set interval
    singlePlayerStartGameInterval(client,state)

    function singlePlayerStartGameInterval(client,state) {
        const intervalId = setInterval(() => {
            const winner = singlePlayergameLoop(state)
            if (!winner) {
                //if no winner send gameState and continue loop
                client.emit('singlePlayergameState', JSON.stringify(state))
                client.emit('showScore')
                
            }
            else{
                client.emit('gameOver')
                // client.emit('showScore')
                clearInterval(intervalId)
            }
        }, 1000 / FRAME_RATE)
    }



    function handleKeydown(keyCode) {
        
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
            state.player.vel = vel
        }
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

io.listen(process.env.PORT|| 3001)