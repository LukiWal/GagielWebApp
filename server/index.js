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
  
    socket.on("send_all", (data) => {
        console.log(data.gameId)
        socket.to(data.gameId).emit("receive", "Hallo");
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
    
    newGame.joinGame(data);

    if(newGame.hasPlayer(data.sessionId)){
        console.log(data.sessionId +" joinded room: " +data.gameId);
        socket.join(data.gameId);        
    }else{
        socket.emit("error_popup", "GAME FULL ERORR!!!");
        return;
    }

    newGame.updateGame(); 
}

async function test(){
    
    var firstGame = new Game()
    await firstGame.fetchGame(1)

    firstGame.player1 = "Doch nicht Luki"
    firstGame.saveGame()
}






server.listen(8800, () =>{
    console.log("SERVER IS RUNNING...")
})