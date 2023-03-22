const db = require('../mySqlConnection');

class Game{
    constructor(){
        this.id = null;
        this.player1 = null;
        this.player2 = null;
    }

    createGame(){
        
    }

    async fetchGame(id){
        
        const sql = "SELECT * FROM `games` WHERE `id`=" +id

        let data = await db.promise(sql);

        this.id = data[0].id;
        this.player1 = data[0].player1;
        this.player2 = data[0].player2;

        if(this.id != null){
            return("done");
        } else{
            throw Error('Nope. Try again.');
        }
        
    }

    saveGame(){
        const sql = "INSERT INTO games (`player1`,`player2`) VALUES (?)"
        const values = [
            this.player1,
            this.player2,
        ]

        db.promiseInsert(sql, values);
    }
}

module.exports = Game