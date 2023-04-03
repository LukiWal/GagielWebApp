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

    /* socket.on("load_game", (data) => {
        loadGame(data, socket);
    }); */

    socket.on("create_game", (data) => {
        
        createGame(data);
    });


});

async function loadGame(game, player, socket){
    await player.fetchPlayerById(player.playerId)

    io.to(player.socketId).emit("load_start_game", {
        playerCards : player.cards, 
        playerPoints : 20,
        trumpCard: game.trumpCard
    })

}

function createGame(data){
    let newGame = new Game();


    newGame.createGame(data);

    newGame.saveGame();
}

async function startGame(data, socket){

    let newGame = new Game()
    await newGame.fetchGame(data.gameId)

    let firstRound = new Round(data.gameId)

    let playerArray = newGame.getPlayerArray();
    firstRound.selectStartingPlayer(playerArray);

    firstRound.saveRound()
    
    let playerObejctArray = await newGame.startGame();

    for(let i = 0; i < playerObejctArray.length; i++){
        const player = playerObejctArray[i]
        console.log(player)

        gameData = {
            playerCards : player.cards, 
            playerPoints : 20,
            trumpCard: newGame.trumpCard
        }

        console.log("PlayerId: " +player.playerId +" PlayerToBeginn: " +firstRound.playerToBeginn)
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

    if(!newGame.maxPlayersReached()){
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



/* async function test(){
    let newRound = new Round()
    newRound.gameId = "AAAAAA"
    newRound.playeToBeginn = 9

    newRound.saveRound() 
    
    await newRound.fetchCurrentRoundByGameId("AAAAAA");
    console.log(newRound)
}

test()  */

server.listen(8800, () =>{
    console.log("SERVER IS RUNNING...")
})