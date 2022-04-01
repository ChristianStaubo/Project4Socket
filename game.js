const {GRIDE_SIZE} = require('./constants')



function createGameState() {
    return {
        players: [{
            pos: {
                x:18,
                y:10,
            },
            vel: {
                x:0,
                y:1,
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
        console.log('player one x pos',playerOne.pos.x)
        console.log('player one pos all', playerOne.pos)

        return 2
    }

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRIDE_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRIDE_SIZE) {
        console.log('player one x pos',playerOne.pos.x)
        console.log('player one pos all', playerOne.pos)
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
            else if (playerOne.snake[i].x === playerTwo.pos.x && playerOne.snake[i].y === playerTwo.pos.y){
                return 1
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
            else if (playerTwo.snake[i].x === playerOne.pos.x && playerTwo.snake[i].y === playerOne.pos.y) {
                return 2
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
let lastInputDirection1 = {x:0,y:1}
let lastInputDirection2 = {x:1,y:0}
function getUpdatedVeolicty(keyCode,number) {
    switch(keyCode) {
        case 37: {
            if (number === 1){
                if (lastInputDirection1.x !== 0) return
            lastInputDirection1 = {x:-1,y:0}
            return {x:-1,y:0}
            }
            else if (number === 2){
                if (lastInputDirection2.x !== 0) return
            lastInputDirection2 = {x:-1,y:0}
            return {x:-1,y:0}
            }
            
        }
        case 38: {
            if (number === 1){
                if (lastInputDirection1.y !== 0) return
            lastInputDirection1 = {x:0,y:-1}
            return {x:0,y:-1}
            }
            else if (number === 2){
                if (lastInputDirection2.y !== 0) return
            lastInputDirection2 = {x:0,y:-1}
            return {x:0,y:-1}
            }
            
        }
        case 39: {
            if (number === 1){
                if (lastInputDirection1.x !== 0) return
            lastInputDirection1 = {x:1,y:0}
            return {x:1,y:0}
            }
            else if(number === 2){
                if (lastInputDirection2.x !== 0) return
            lastInputDirection2 = {x:1,y:0}
            return {x:1,y:0}
            }
            
        }
        case 40: {
            if (number === 1){
                if (lastInputDirection1.y !== 0) return
            lastInputDirection1 = {x:0,y:1}
            return {x:0,y:1}
            }
            else if (number === 2){
                if (lastInputDirection2.y !== 0) return
            lastInputDirection2 = {x:0,y:1}
            return {x:0,y:1}
            }
            
        }
    }
}

function singlePlayercreateGameState() {
    return {
    player: {
        pos: {
            x:3,
            y:10,
        },
        vel: {
            x:0,
            y:0,
        },
        snake: [
            {x:1, y:10},
            {x:2,y:10},
            {x:3,y:10},
        ]
    },
    food: {
        x: 7,
        y: 7,
    },
    gridSize: 20,
    score: 0
}
}

function singlePlayergameLoop(state) {
    if (!state) {
        return
    }

    const playerOne = state.player
    
    //increment player position by velocity (movement)
    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    
    //check if player lost
    if (playerOne.pos.x < 0 || playerOne.pos.x > 20 || playerOne.pos.y < 0 || playerOne.pos.y > 20) {
        return 2
    }

    
    //if player eats food, increase size and randomize new food position
    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        singlePlayerandomFood(state)
        console.log('Food is eaten')
        state.score += 1
        incrementCount()
        
        console.log('Count is now => ', count)
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

    
    return false
}

let count = 1
function singlePlayerandomFood(state) {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
    }
    //check if random food location isn't on the snake, if so randomize again
    for (let i = 0 ; i < state.player.snake.length ; i++){
        if (state.player.snake[i].x === food.x && state.player.snake[i].y === food.y) {
            return singlePlayerandomFood(state)
        }
    }



    state.food = food
}

function incrementCount() {
   count += 1
}


module.exports = {
    initGame,
    gameLoop,
    getUpdatedVeolicty,
    createGameState,
    singlePlayercreateGameState,
    singlePlayergameLoop,
    getUpdatedVeolicty,
    count
}