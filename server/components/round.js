const db = require('../mySqlConnection');

class Round{ 
    constructor(gameId){
        this.id = null;
        this.gameId = gameId;  //Foreign Key
        this.playerToBeginn = null;
        this.card1 = null;
        this.card2 = null;
        this.card3 = null;
        this.card4 = null;
    }

    selectStartingPlayer(playerArray){
        const randomPlayerId = playerArray[Math.floor(Math.random() * playerArray.length)];

        this.playerToBeginn = randomPlayerId;
    }

    updateRound(){

    }

    saveRound(){
        const sql = "INSERT INTO rounds (`gameId`,`playerToBeginn`,`card1`,`card2`,`card3`,`card4`) VALUES (?)"
        const values = [
            this.gameId,
            this.playerToBeginn,
            this.card1,
            this.card2,
            this.card3,
            this.card4
        ]

        db.promiseInsert(sql, values);
    }

    async fetchCurrentRoundByGameId(gameId){
        //const sql = "SELECT * FROM `rounds` WHERE `gameId`='" +gameId +"'"
        //const sql = "select * FROM `rounds` where `gameId`='" +gameId +"' having max(id)"
        const sql = "SELECT * FROM rounds WHERE id IN ( SELECT MAX(id) FROM rounds) AND `gameId`='" +gameId +"'"
       
        let data = await db.promise(sql);


        this.id = data[0].id;
        this.gameId = data[0].gameId;
        this.playeToBeginn = data[0].playerToBeginn;
        this.card1 = data[0].card1;
        this.card2 = data[0].card2;
        this.card3 = data[0].card3;
        this.card4 = data[0].card4;

        if(this.id != null){
            return("done");
        } else{
            throw Error('Nope. Try again.');
        }
    }
}


module.exports = Round