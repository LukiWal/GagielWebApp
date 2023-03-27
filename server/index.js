const express = require('express');
const http = require('http');
const cors = require("cors");
const {Server} = require('socket.io');

const Game = require('./components/game')
const Player = require('./components/player')

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


    socket.on("join_room", (data) => {
        joinGame(data, socket)
       
    });

    socket.on("create_game", (data) => {
        
        createGame(data);
    });
});

function createGame(data){
    let newGame = new Game();


    newGame.createGame(data);

    newGame.saveGame();
}

async function joinGame(data, socket){
    let newGame = new Game();

    try{
        await newGame.fetchGame(data.gameId);
    }catch(e){
        socket.emit("error_popup", "WRONG CODE ERORR!!!");
        return;
    }
    
    await newGame.joinGame(data, socket.id);

    let newPlayer = new Player(data.sessionId, data.gameId, null);
    let playerId = await newPlayer.doesPlayerExist();    

    if(newGame.hasPlayer(playerId)){
        console.log(data.sessionId +" joinded room: " +data.gameId);
        socket.join(data.gameId);        
    }else{
        socket.emit("error_popup", "GAME FULL ERORR!!!");
        return;
    }

    if(newGame.maxPlayersReached()){
        newGame.startGame();
    }

    newGame.updateGame(); 
}

async function test(){
    
    var firstPlayer = new Player();
    
    firstPlayer.sessionId = "NCMOUx38OJ"
    firstPlayer.gameId = "O7XPX6"
    firstPlayer.socketId = "O7XPX6"

    let id = await firstPlayer.doesPlayerExist()
    
    console.log("Exists? " +id)
}





server.listen(8800, () =>{
    console.log("SERVER IS RUNNING...")
})