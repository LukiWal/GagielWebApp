const db = require('../mySqlConnection');

class Round{ 
    constructor(gameId, playerToBeginn){
        this.id = null;
        this.gameId = gameId;  //Foreign Key
        this.playerToBeginn = playerToBeginn;
        this.card1 = null;
        this.card2 = null;
        this.card3 = null;
        this.card4 = null;
    }

    allCardsPlayed(playerArray){
        const cardsArray = this.getCardsArray();

        if(playerArray.length == cardsArray.length){
            return true
        } else{
            return false;
        }  
    }

    checkIfItsPlayersTurn(playerArray, playerId){
        let cardsArray = this.getCardsArray();
        let cardsPlayed = cardsArray.length;

        let playerToBeginnIndex = playerArray.indexOf(this.playerToBeginn);
        
        let playerIndexToPlay = playerToBeginnIndex + cardsPlayed;
        let playerIdToPlay = playerArray[playerIndexToPlay % playerArray.length]

        if(playerIdToPlay == playerId){
            console.log("Players turn")
            return true;
        } else{
            console.log("Not your turn ")
            return false;
        }
    }

    getNextPlayerId(playerArray){
        let playerToBeginnIndex = playerArray.indexOf(this.playerToBeginn);

        playerToBeginnIndex = playerToBeginnIndex + 1;
        let playerToBeginnId = playerArray[playerToBeginnIndex % playerArray.length]
        
        return playerToBeginnId;
    }

    getCardsArray(){
        const allCardsArray = [this.card1, this.card2, this.card3, this.card4];
        const cardArray = [];

        allCardsArray.forEach(function (card){
            if(card != null){
                cardArray.push(card);
            }
        });

        return cardArray;
    }

    selectStartingPlayer(playerArray){
        const randomPlayerId = playerArray[Math.floor(Math.random() * playerArray.length)];

        this.playerToBeginn = randomPlayerId;
    }

    playCard(card){
        if(!this.card1){
            this.card1 = card;
        }else if(!this.card2){
            this.card2 = card;
        } else if(!this.card3){
            this.card3 = card;
        } else if(!this.card4){
            this.card4 = card;
        }
    }

    updateRound(){
        const sql = "UPDATE rounds SET ? WHERE id = ?"
        const values = {
            playerToBeginn : this.playerToBeginn,
            card1 : this.card1,
            card2 : this.card2,
            card3 : this.card3,
            card4 : this.card4
        }
           
        db.promiseUpdate(sql, [values, this.id])
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
        this.playerToBeginn = data[0].playerToBeginn;
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