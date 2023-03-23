const db = require('../mySqlConnection');

class Game{
    constructor(){
        this.id = null;
        this.gameId = null;
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
    }

    createGame(data){
        
        this.gameId = data.newGameId
        this.player1 = data.sessionId
    }

    joinGame(data){
        if( this.player1 == data.sessionId ||
            this.player2 == data.sessionId ||
            this.player3 == data.sessionId ||
            this.player4 == data.sessionId 
        ){
            console.log("Already in game")
            return 0;
            //Already in game, send game data to player
        }

        console.log(this.player2)
        if(!this.player2){
            this.player2 = data.sessionId
            console.log("Player2 added")
            return 0;
            
        } else if(!this.player3){
            this.player3 = data.sessionId
            console.log("Player3 added")
            return 0;
        } else if(!this.player4){
            this.player4 = data.sessionId
            console.log("Player4 added")
            return 0;
        }
       
        //Throw error if full
    }

    async fetchGame(gameId){
        
        const sql = "SELECT * FROM `games` WHERE `gameId`='" +gameId +"'"

        let data = await db.promise(sql);

        //Check if game was found
            //else error

        this.id = data[0].id;
        this.gameId = data[0].gameId;
        this.player1 = data[0].player1;
        this.player2 = data[0].player2;

        if(this.id != null){
            return("done");
        } else{
            throw Error('Nope. Try again.');
        }
        
    }

    saveGame(){
        const sql = "INSERT INTO games (`gameId`,`player1`,`player2`) VALUES (?)"
        const values = [
            this.gameId,
            this.player1,
            this.player2,
        ]

        db.promiseInsert(sql, values);
    }

    updateGame(){
        const sql = "UPDATE games SET ? WHERE gameId = ?"
        const values = {
            player1 : this.player1,
            player2 : this.player2,
        }
           
        db.promiseUpdate(sql, [values, this.gameId]);
    }
}

module.exports = Game