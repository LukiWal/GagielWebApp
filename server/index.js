const express = require('express');
const http = require('http');
const cors = require("cors");
const {Server} = require('socket.io');

const Game = require('./components/game')

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
  
    socket.on("join_room", (data) => {
        console.log(data);
    });
});


async function createGame(){
    
    var firstGame = new Game()
    await firstGame.fetchGame(1)

    firstGame.player1 = "Doch nicht Luki"
    firstGame.saveGame()
    console.log("index.js: " +JSON.stringify(firstGame))
}


createGame();



server.listen(8800, () =>{
    console.log("SERVER IS RUNNING...")
})