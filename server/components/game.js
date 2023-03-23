const db = require('../mySqlConnection');

class Game{
    constructor(){
        this.id = null;
        this.gameId = null;
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
        this.maxPlayers = 3;
    }

    createGame(data){
        
        this.gameId = data.newGameId
        this.player1 = data.sessionId
    }

    joinGame(data){
        if(!this.hasPlayer(data.sessionId) && !this.maxPlayersReached()){
            if(!this.player2){
                this.player2 = data.sessionId;
            } else if(!this.player3){
                this.player3 = data.sessionId;
            } else if(!this.player4){
                this.player4 = data.sessionId;
            }
        }
    }

    hasPlayer(sessionId){
        if( this.player1 == sessionId ||
            this.player2 == sessionId ||
            this.player3 == sessionId ||
            this.player4 == sessionId 
        ){
            return true;    
        }else{
            return false;
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