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
        currentRound.playCard(data.card);
        player.removeCard(data.card);
       
        await player.updatePlayer();
        currentRound.updateRound();

        io.in(data.gameId).emit("load_start_game", {
            currentCard : data.card
        })

        if(currentRound.allCardsPlayed(playerArray)){
            const [points, highestCardIndex] = currentRound.evaluateRound(game.trumpCard);
            const playerIdForHighestCard = currentRound.playerIdForHighestCard(playerArray, currentRound.playerToBeginn, highestCardIndex);

            let playerWon = new Player();
            await playerWon.fetchPlayerById(playerIdForHighestCard);

            io.to(playerWon.socketId).emit("error_popup", "YOU WON :))");
            playerWon.points += points; 

            callback();

            io.to(playerWon.socketId).emit("load_start_game", {
                playerPoints : playerWon.points,
                playersTurn : true
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
            callback();
            io.to(nextPlayer.socketId).emit("load_start_game", {
                playersTurn : true
            }) 
        } 
    }
}

async function loadGame(game, player, socket){
    await player.fetchPlayerById(player.playerId);

    let currentRound = new Round()
    await currentRound.fetchCurrentRoundByGameId(game.gameId);

    let playerArray = game.getPlayerArray()
    let nextPlayerId = currentRound.getNextPlayerId(playerArray);

    let playersTurn = false; 
    
    if(player.playerId == nextPlayerId){
        playersTurn = true;
    }

    io.to(player.socketId).emit("load_start_game", {
        playerCards : player.cards, 
        playerPoints : player.points,
        trumpCard: game.trumpCard,
        currentCard : "tste",
        playersTurn : playersTurn
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

    let firstRound = new Round(data.gameId)

    let playerArray = newGame.getPlayerArray();
    firstRound.selectStartingPlayer(playerArray);

    firstRound.saveRound()
    
    let playerObejctArray = await newGame.startGame();

    for(let i = 0; i < playerObejctArray.length; i++){
        const player = playerObejctArray[i]


        gameData = {
            playerCards : player.cards, 
            playerPoints : player.points,
            trumpCard: newGame.trumpCard
        }

       
        if(player.playerId == firstRound.playerToBeginn){
            gameData.playersTurn = true
        } else {
            gameData.playersTurn = false
        }

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

    if(!newGame.maxPlayersReached()){ //AND PLAYER NOT IN GAME ALREADY
        console.log("new player joinded")
        await newGame.joinGame(data, socket.id);
    }else{
        

        newPlayer.playerId = await newPlayer.doesPlayerExist(); 
        
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