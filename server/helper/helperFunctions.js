//Herz, Bollen, Eichel, Schippen 
const createDeckOfCards=()=>{
    const sortedDeckOfCards = ["H_7","H_10","H_U", "H_O", "H_K", "H_A",
                                "B_7","B_10","B_U", "B_O", "B_K", "B_A",
                                "E_7","E_10","E_U", "E_O", "E_K", "E_A",
                                "S_7","S_10","S_U", "S_O", "S_K", "S_A",   
                                ];
    
    let deckOfCards = sortedDeckOfCards.concat(sortedDeckOfCards);

    //Durstenfeld Shuffle
    for (var i = deckOfCards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        [deckOfCards[i], deckOfCards[j]] = [deckOfCards[j], deckOfCards[i]];
    }

    return deckOfCards;
}

module.exports = createDeckOfCards