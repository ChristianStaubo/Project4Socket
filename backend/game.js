const {GRIDE_SIZE} = require('./constants')

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVeolicty
}

function createGameState() {
    return {
        players: [{
            pos: {
                x:18,
                y:10,
            },
            vel: {
                x:0,
                y:0,
            },
            snake: [
                {x:20, y:10},
                {x:19,y:10},
                {x:18,y:10},
            ]
        },
        {
            pos: {
                x:3,
                y:10,
            },
            vel: {
                x:1,
                y:0,
            },
            snake: [
                {x:1, y:10},
                {x:2,y:10},
                {x:3,y:10},
            ]
        },
    ],
        
        food: {},
        gridSize: GRIDE_SIZE
    }
}

function initGame() {
    const state = createGameState()
    randomFood(state)
    return state
}

function gameLoop(state) {
    if (!state) {
        return
    }

    const playerOne = state.players[0]
    const playerTwo = state.players[1]
    //increment player position by velocity (movement)
    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    playerTwo.pos.x += playerTwo.vel.x
    playerTwo.pos.y += playerTwo.vel.y
    //check if player lost
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRIDE_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRIDE_SIZE) {
        return 2
    }

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRIDE_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRIDE_SIZE) {
        return 1
    }
    //if player eats food, increase size and randomize new food position
    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state)
    }

    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
        playerTwo.snake.push({...playerTwo.pos})
        playerTwo.pos.x += playerTwo.vel.x
        playerTwo.pos.y += playerTwo.vel.y
        randomFood(state)
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let i = 0 ; i < playerOne.snake.length ; i++){
            if (playerOne.snake[i].x === playerOne.pos.x && playerOne.snake[i].y === playerOne.pos.y) {
                return 2
            }
        }
        //add to head of snake and remove its last element for movement
        playerOne.snake.push({...playerOne.pos})
        playerOne.snake.shift()
    }

    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let i = 0 ; i < playerTwo.snake.length ; i++){
            if (playerTwo.snake[i].x === playerTwo.pos.x && playerTwo.snake[i].y === playerTwo.pos.y) {
                return 1
            }
        }
        //add to head of snake and remove its last element for movement
        playerTwo.snake.push({...playerTwo.pos})
        playerTwo.snake.shift()
    }
    return false
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRIDE_SIZE),
        y: Math.floor(Math.random() * GRIDE_SIZE),
    }
    //check if random food location isn't on the snake, if so randomize again
    for (let i = 0 ; i < state.players[0].snake.length ; i++){
        if (state.players[0].snake[i].x === food.x && state.players[0].snake[i] === food.y) {
            return randomFood(state)
        }
    }

    for (let i = 0 ; i < state.players[1].snake.length ; i++){
        if (state.players[1].snake[i].x === food.x && state.players[1].snake[i] === food.y) {
            return randomFood(state)
        }
    }


    state.food = food
}

function getUpdatedVeolicty(keyCode) {
    switch(keyCode) {
        case 37: {
            return {x:-1,y:0}
        }
        case 38: {
            return {x:0,y:-1}
        }
        case 39: {
            return {x:1,y:0}
        }
        case 40: {
            return {x:0,y:1}
        }
    }
}