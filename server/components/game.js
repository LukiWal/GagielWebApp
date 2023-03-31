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
    }

    createGame(data){
        this.gameId = data.newGameId;
    }
    
    getCards(numberOfCards){
        const cardArray = this.deckOfCards.slice(0, numberOfCards);
        this.deckOfCards = this.deckOfCards.slice(numberOfCards);
        return cardArray;
    }

    async startGame(){
        this.deckOfCards = createDeckOfCards();
    
        const playerArray = this.getPlayerArray();
        let playerObjectArray = [];

        for(let i = 0; i < playerArray.length; i++){
            let player = new Player()
            await player.fetchPlayerById(playerArray[i])

            player.cards = this.getCards(5);
            playerObjectArray.push(player);
            player.updatePlayer();
        }

        return playerObjectArray;
    }

    hasPlayer(playerId){
        if(playerId == null || playerId == false){

            return false;
        }

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
        let newPlayer = new Player(data.sessionId, data.gameId, socketId);
        
        
        try{
            
            const newId = await newPlayer.savePlayerAndGetId();
            
            if(!this.player1){
                this.player1 = newId;
            }else if(!this.player2){
                this.player2 = newId;
            } else if(!this.player3){
                this.player3 = newId;
            } else if(!this.player4){
                this.player4 = newId;
            }

            

            this.updateGame();
        }catch(e){
            
            
            
            newPlayer.playerId = await newPlayer.doesPlayerExist();

            

            newPlayer.updatePlayer();
            
            
            return;
        } 
    }

    getPlayerArray(){
        const allPlayerArray = [this.player1, this.player2, this.player3, this.player4];
        const playerArray = [];

        allPlayerArray.forEach(function (player){
            if(player != null){
                playerArray.push(player);
            }
        });

        return playerArray;
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
            deckOfCards : JSON.stringify(this.deckOfCards)
        }
           
        db.promiseUpdate(sql, [values, this.gameId]);
    }
}

module.exports = Game