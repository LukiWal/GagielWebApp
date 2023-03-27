const db = require('../mySqlConnection');
const createDeckOfCards = require('../helper/helperFunctions')
const Player = require('./player.js')

class Game{
    constructor(){
        this.id = null;
        this.gameId = null;
        this.maxPlayers = 3;
        this.deckOfCards = [];
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
        this.player1Cards = [];
        this.player2Cards = [];
        this.player3Cards = [];
        this.player4Cards = [];
    }

    createGame(data){
        this.gameId = data.newGameId 
    }

    startGame(){
        this.deckOfCards = createDeckOfCards();
    }

    async hasPlayer(playerId){
        if( this.player1 == playerId ||
            this.player2 == playerId ||
            this.player3 == playerId ||
            this.player4 == playerId 
        ){
            return true;    
        }else{
            return false;
        }
    }

    async joinGame(data, socketId){
        

        //data.sessionId data.gameID socketId

        //Check if sessionId and data.gameId already exists in players table

        let newPlayer = new Player(data.sessionId, data.gameId, socketId);
       
        newPlayer.playerId = await newPlayer.doesPlayerExist();
        //If not create new player
        console.log("Player Id " +newPlayer.playerId)
        if(!newPlayer.playerId){
            if(!this.maxPlayersReached()){

                //create new player

                
                //save player
                const newId = await newPlayer.savePlayerAndGetId();
                console.log(newId)
                //fetch player for id 
                if(!this.player1){
                    this.player1 = newId;
                }else if(!this.player2){
                    this.player2 = newId;
                } else if(!this.player3){
                    this.player3 = newId;
                } else if(!this.player4){
                    this.player4 = newId;
                }
            }
            
        } else {
            newPlayer.updatePlayer();
        }
    }

   

    maxPlayersReached(){
        const playerArray = [this.player1, this.player2, this.player3, this.player4];
        let playerCount = 0;

        playerArray.forEach(function (player){
            if(player != null){
                playerCount += 1;
            }
        });

        if(this.maxPlayers <= playerCount){
            console.log("Max players reached")
            return true;
        } else{
            return false;
        }
    }

    async fetchGame(gameId){
        
        const sql = "SELECT * FROM `games` WHERE `gameId`='" +gameId +"'"
        
        let data = await db.promise(sql);


        this.id = data[0].id;
        this.gameId = data[0].gameId;
        this.player1 = data[0].player1;
        this.player2 = data[0].player2;
        this.player3 = data[0].player3;
        this.player4 = data[0].player4;

        if(this.id != null){
            return("done");
        } else{
            throw Error('Nope. Try again.');
        }
        
    }

    saveGame(){
        const sql = "INSERT INTO games (`gameId`,`player1`,`player2`,`player3`,`player4`) VALUES (?)"
        const values = [
            this.gameId,
            this.player1,
            this.player2,
            this.player3,
            this.player4
        ]

        db.promiseInsert(sql, values);
    }

    updateGame(){
        const sql = "UPDATE games SET ? WHERE gameId = ?"
        const values = {
            player1 : this.player1,
            player2 : this.player2,
            player3 : this.player3,
            player4 : this.player4,
        }
           
        db.promiseUpdate(sql, [values, this.gameId]);
    }
}

module.exports = Game