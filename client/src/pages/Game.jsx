import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import Card from '../components/Card';




const Game = ({sessionId}) => {
    
    let params = useParams();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [playerCards, setPlayerCards] = useState([]);
    const [playerPoints, setPlayerPoints] = useState("");
    const [currentCard, setCurrentCard] = useState("");
    const [trumpCard, setTrumpCard] = useState("");
    const [playersTurn, setPlayersTurn] = useState(false);
    

    const startGame = () => {
        socket.emit("start_game", { gameId: params.roomId});
    };


    useEffect(() => {
        console.log("JOIN ROOM")
    
        if(sessionId){
            console.log("SessionId: " +sessionId)
            
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId}, function(){
                /* socket.emit("load_game", { gameId: params.roomId }) */
            }); 
        } 
    },[] );
    
    useEffect(() => {
        function errorPopuop(data){   
            setShowErrorPopup(true);
            setErrorMessage(data);
        }

        function startGameData(data){
            if (data.playerCards) setPlayerCards(data.playerCards);
            if (data.playerPoints) setPlayerPoints(data.playerPoints);
            if (data.trumpCard) setTrumpCard(data.trumpCard);
            if(data.playersTurn) setPlayersTurn(data.playersTurn) 
            if(data.currentCard) setCurrentCard(data.currentCard)
        }
    
        socket.on("error_popup", errorPopuop);
        socket.on("load_start_game", startGameData);

        return () => {
            socket.off('error_popup', errorPopuop);
            socket.off("load_start_game", startGameData);
        }
    }, []);

  
    const cardPlayedEmit = (card) => {
        socket.emit("play_card", {gameId: params.roomId, sessionId: sessionId, card: card}, function(){
            setPlayersTurn(false) 
        });
    }
    let listItems = null;

    if(playerCards.length > 0){

        var playerCardsVar = playerCards
        listItems = playerCardsVar.map((d) => <Card key={d} card={d} cardPlayedEmit={cardPlayedEmit}></Card>);
    } 
    
    
    return  <div>
                <h1>Game {params.roomId} </h1>
                <h2>Session ID: {sessionId}</h2>
          
                <button onClick={() => {startGame()}}> Start Game</button>
                { showErrorPopup && (<div> ERORR: {errorMessage}</div>)}

                <h2>Game State:</h2>
                <h3>Spieler an der Reihe: { playersTurn && ( "YES")}</h3>
                <h3>Spieler Punkte: {playerPoints}</h3>
                <h3>Trumpf Karte: {trumpCard}</h3>
                <h3>Current Card: {currentCard}</h3>

                <h3>Spieler Karten: {playerCards}</h3>

                <ul>
                   {listItems}
                </ul>
            </div>;
};
  
export default Game;