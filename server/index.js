const express = require('express');
const http = require('http');
const cors = require("cors");
const {Server} = require('socket.io');

const Game = require('./components/game')
const Player = require('./components/player')
const Round = require('./components/round')

const app = express();
app.use(cors);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log(io.engine.clientsCount)
  
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        console.log(io.engine.clientsCount)
    });

    socket.on("session_id", (data) => {
        console.log(" belongs to " +data)
    });


    socket.on("join_room", async (data, callback) => {
        await joinGame(data, socket) 
    });

    socket.on("start_game", (data) => {
        startGame(data, socket) 
    });

    socket.on("play_card", (data, callback) => {
        playCard(data, callback)
    });

    socket.on("meld_card", (data) => {
        meldCard(data);
    }); 

    socket.on("exchange_trump", (data) => {
        exchangeTrump(data);
    }); 
    /* socket.on("load_game", (data) => {
        loadGame(data, socket);
    }); */

    socket.on("create_game", (data) => {
        
        createGame(data);
    });


});

async function playCard(data, callback){
    let currentRound = new Round()
    await currentRound.fetchCurrentRoundByGameId(data.gameId);

    let game = new Game();
    await game.fetchGame(data.gameId)

    let player = new Player(data.sessionId, data.gameId);
    let playerId = await player.doesPlayerExist();
    await player.fetchPlayerById(playerId);

    let playerArray = game.getPlayerArray();
    
    if(currentRound.checkIfItsPlayersTurn(playerArray, playerId)){
        if(game.deckOfCards.length >= 1 || !currentRound.card1){
            currentRound.playCard(data.card);
            player.removeCard(data.card);
        }else{
            if(currentRound.playCardWithServe(data.card, game.trumpCard, player.cards)){
                player.removeCard(data.card);
            } else{
                io.to(player.socketId).emit("error_popup", "YOU HAVE TO SERVE CARDS");
                return;
            }
        }

        if(player.trick){
            let meldCard = player.playerMeldCard(data.card, game.trumpCard)
            if(meldCard){
                //Emit Meld 
            };
        }
    
        await player.updatePlayer();
        currentRound.updateRound();

        io.in(data.gameId).emit("load_start_game", {
            currentCards : currentRound.getCardsArray()
        })

        if(currentRound.allCardsPlayed(playerArray)){
            const [points, highestCardIndex] = currentRound.evaluateRound(game.trumpCard);
            const playerIdForHighestCard = currentRound.playerIdForHighestCard(playerArray, currentRound.playerToBeginn, highestCardIndex);

            let playerWon = new Player();
            await playerWon.fetchPlayerById(playerIdForHighestCard);

            io.to(playerWon.socketId).emit("error_popup", "YOU WON :))");
            playerWon.trick = true;
            playerWon.points += points; 

            //callback();

           /*  io.to(playerWon.socketId).emit("load_start_game", {
                playerPoints : playerWon.points,
                playersTurn : true
            }) */

            io.to(game.gameId).emit("load_start_game", {
                playerPoints : playerWon.points,
                playersTurn : playerWon.playerId
            }) 
        
            await playerWon.updatePlayer();
            //Check if player points > 101 
                //Send game won message

            for(let i = 0; i < playerArray.length; i++){
                let player = new Player();
                await player.fetchPlayerById(playerArray[i]);
                player.addCard(game.getCards(1));

                await game.updateGame();

                gameData = {
                    playerCards : player.cards, 
                }

                io.to(player.socketId).emit("load_start_game", gameData)

                player.updatePlayer();
            }


            let newRound = new Round(data.gameId, playerIdForHighestCard);
            newRound.saveRound();

            return;
        }

        let nextPlayerId = currentRound.getNextPlayerId(playerArray);
        let nextPlayer = new Player();
        await nextPlayer.fetchPlayerById(nextPlayerId);

         if(nextPlayer.playerId != player.playerId){
            //callback();
            io.to(game.gameId).emit("load_start_game", {
                playersTurn : nextPlayer.playerId
            }) 
        }  
    }
}

async function meldCard(data){
    let player = new Player(data.sessionId, data.gameId);
    let playerId = await player.doesPlayerExist();
    await player.fetchPlayerById(playerId);

    let game = new Game();
    await game.fetchGame(data.gameId)
    
    player.playerMeldCard(data.card, game.trumpCard)

}

async function exchangeTrump(data){
    let player = new Player(data.sessionId, data.gameId);
    let playerId = await player.doesPlayerExist();
    await player.fetchPlayerById(playerId);

    let currentRound = new Round()
    await currentRound.fetchCurrentRoundByGameId(data.gameId);

    let game = new Game();
    await game.fetchGame(data.gameId)

    const [trumpColor, trumpValue] = game.trumpCard.split(":").pop().split('_');

    if(playerId == currentRound.playerToBeginn && !currentRound.card1 && player.trick){
        let trumpSeven = player.cards.filter(element => element.includes(trumpColor +"_7"));
        trumpSeven = trumpSeven[0]
        console.log(trumpSeven)
        if(trumpSeven.length > 0){
            player.cards.pop(trumpSeven);
            player.cards.push(game.trumpCard)
            game.trumpCard = trumpSeven

            let playerData = {
                playerCards : player.cards
            }

            let newTrumpData = {
                trumpCard: game.trumpCard
            }
        
            io.to(player.socketId).emit("load_start_game", playerData)
            io.to(game.gameId).emit("load_start_game", newTrumpData);
        }
    }

    game.updateGame();
    player.updatePlayer();

}

async function loadGame(game, player, socket){
    
    console.log(player);
    await player.fetchPlayerById(player.playerId);
 
    let currentRound = new Round()

    console.log(game.gameId)
    await currentRound.fetchCurrentRoundByGameId(game.gameId);

    let playerArray = game.getPlayerArray()
    let nextPlayerId = currentRound.getNextPlayerId(playerArray);
   
    let indexOfPlayer = playerArray.indexOf(player.playerId);

    let firstArrayPart = playerArray.slice(0, indexOfPlayer);
    let secondArrayPart = playerArray.slice(indexOfPlayer);

    playerArray = secondArrayPart.concat(firstArrayPart);

    io.to(player.socketId).emit("load_start_game", {
        playerCards : player.cards, 
        playerPoints : player.points,
        trumpCard: game.trumpCard,
        playersTurn : nextPlayerId,
        playerArray: playerArray,
        currentCards: currentRound.getCardsArray(),
        hasStarted: game.hasStarted
    })

}

function createGame(data){
    let newGame = new Game();


    newGame.createGame(data);

    newGame.saveGame();
}

async function startGame(data, socket){

    //CHECK IF GAME FULL ELSE RETURN ERROR
    let newGame = new Game()
    await newGame.fetchGame(data.gameId)

    let playerArray = newGame.getPlayerArray();

    if(playerArray.length <= 1){
        socket.emit("error_popup", "Not enough Players to start the Game!");
        return;
    }

    let firstRound = new Round(data.gameId);
    firstRound.selectStartingPlayer(playerArray);

    firstRound.saveRound()
    
    let playerObejctArray = await newGame.startGame();

    for(let i = 0; i < playerObejctArray.length; i++){
        const player = playerObejctArray[i]

        // player.id
        
        let indexOfPlayer = playerArray.indexOf(player.playerId);
    
        console.log(player.playerId)
        firstArrayPart = playerArray.slice(0, indexOfPlayer);
        secondArrayPart = playerArray.slice(indexOfPlayer);

        console.log(firstArrayPart)
        console.log(secondArrayPart)
        playerArray = secondArrayPart.concat(firstArrayPart);
        
        gameData = {
            playerCards : player.cards, 
            playerPoints : player.points,
            trumpCard: newGame.trumpCard,
            playerArray: playerArray,
            playersTurn: firstRound.playerToBeginn,
            hasStarted : newGame.hasStarted
        }

       
            /*         if(player.playerId == firstRound.playerToBeginn){
            gameData.playersTurn = true
        } else {
            gameData.playersTurn = false
        } */

        io.to(player.socketId).emit("load_start_game", gameData)
    }

    newGame.updateGame(); 
}

async function joinGame(data, socket){
    let newGame = new Game();

    try{
        await newGame.fetchGame(data.gameId);
    }catch(e){
        socket.emit("error_popup", "WRONG CODE ERORR!!!");
        return;
    }

    let newPlayer = new Player(data.sessionId, data.gameId, socket.id);
    newPlayer.playerId = await newPlayer.doesPlayerExist(); 

    if(!newGame.maxPlayersReached() && !newGame.hasStarted && !newPlayer.playerId){ //AND PLAYER NOT IN GAME ALREADY
        console.log("new player joinded")
        await newGame.joinGame(data, socket.id);
    }else{
        if(newPlayer.playerId){
            newPlayer.updatePlayer(); 
        }else{
            socket.emit("error_popup", "GAME FULL ERROR");
            return;  
        } 
    }

    if(newGame.hasStarted && newPlayer){
        await loadGame(newGame, newPlayer, socket);
    } 

    socket.join(data.gameId);
}



async function test(){
    let newRound = new Round()
    
    newRound.card1 = "S_10";
    newRound.card2 = "H_7";
    newRound.card3 = "S_A";
    newRound.card4 = "H_K";
    //await newRound.fetchCurrentRoundByGameId("AAAAAA");
}

//test()  

server.listen(8800, () =>{
    console.log("SERVER IS RUNNING...")
})