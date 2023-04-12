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

    playerIdForHighestCard(playerArray, playerToBeginnId, highestCardIndex){
        let playerToBeginnIndex = playerArray.indexOf(playerToBeginnId);

        let playerWithHighestCardIndex = playerToBeginnIndex + highestCardIndex;
        let playerWithHighestCardId = playerArray[playerWithHighestCardIndex % playerArray.length]
        
        return playerWithHighestCardId;
    }

    evaluateRound(trumpCard){
        let cardArray = this.getCardsArray();

        let highestCard = cardArray[0];
        let points = this.getValueOfCard(cardArray[0].split('_')[1]);

        for(let i = 1; i < cardArray.length; i++){
            points += this.getValueOfCard(cardArray[i].split('_')[1]);
            if(this.compareCards(highestCard, cardArray[i], trumpCard)){
                highestCard = cardArray[i];
            }
        }

        return [points, cardArray.indexOf(highestCard)]
    }

    compareCards(card1, card2, trumpCard){
        const [card1Color, card1Value] = card1.split('_');
        const [card2Color, card2Value] = card2.split('_');
        const [trumpCardColor, trumpCardValue] = trumpCard.split('_');
      
        if(card1Color == trumpCardColor && card2Color != trumpCardColor){
            return false;
        } else if(card1Color != trumpCardColor && card2Color == trumpCardColor){
            return true;
        } else{
            if(this.getValueOfCard(card1Value) < this.getValueOfCard(card2Value)){
                return true;
            }else{
                return false;
            }
        }
    }

    getValueOfCard(cardSymbol){
        switch(cardSymbol) {
            case '7':
                return 0;
            case '10':
                return 10;
            case 'U':
                return 2;
            case 'O':
                return 3;
            case 'K':
                return 4;
            case 'A':
                return 11;
          }
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
            return true;
        } else{
            return false;
        }
    }

    getCurrentPlayerId(playerArray){
        let playerToBeginnIndex = playerArray.indexOf(this.playerToBeginn);


        let playerToBeginnId = playerArray[playerToBeginnIndex % playerArray.length]
        
        return playerToBeginnId;
    }

    getNextPlayerId(playerArray){
        let playerToBeginnIndex = playerArray.indexOf(this.playerToBeginn);

        let cardsPlayed = this.getCardsArray().length;
        playerToBeginnIndex = playerToBeginnIndex + cardsPlayed;
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