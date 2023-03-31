import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';




const Game = ({sessionId}) => {
    
    let params = useParams();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [playerCards, setPlayerCards] = useState("");
    const [playerPoints, setPlayerPoints] = useState("");
    const [trumpCard, setTrumpCard] = useState("");

    const startGame = () => {
        socket.emit("start_game", { gameId: params.roomId});
    };


    useEffect(() => {
        console.log("JOIN ROOM")
  
        if(sessionId){
            console.log("SessionId: " +sessionId)
            
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId}, function(){
                console.log("JOINED THE ROOM")
            }); 
        } 
    },[] );
    
    useEffect(() => {
        function errorPopuop(data){   
            setShowErrorPopup(true);
            setErrorMessage(data);
        }

        function startGame(data){
            setPlayerCards(data[0].playerCards);
            setPlayerPoints(data[0].playerPoints);
            setTrumpCard(data[0].trumpCard);
        }
    
        socket.on("error_popup", errorPopuop);
        socket.on("start_game", startGame);

        return () => {
            socket.off('error_popup', errorPopuop);
            socket.off("start_game", startGame);
        }
    }, []);

  
    
    return  <div>
                <h1>Game {params.roomId} </h1>
                <h2>Session ID: {sessionId}</h2>
          
                <button onClick={startGame}> Start Game</button>
                { showErrorPopup && (<div> ERORR: {errorMessage}</div>)}

                <h2>Game State:</h2>
                <h3>Spieler Karten: {playerCards}</h3>
                <h3>Spieler Punkte: {playerPoints}</h3>
                <h3>Trumpf Karte: {trumpCard}</h3>

            </div>;
};
  
export default Game;