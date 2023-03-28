import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';




const Game = ({sessionId}) => {
    
    let params = useParams();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
 

    const startGame = () => {
 
        
        socket.emit("start_game", { gameId: params.roomId});
            
           
        
    };


    useEffect(() => {
        console.log("JOIN ROOM")
  
        if(sessionId){
            console.log("SessionId: " +sessionId)
            
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId}); 
        } 
    },[] );
    
    useEffect(() => {

        function errorPopuop(data){   
            setShowErrorPopup(true);
            setErrorMessage(data);
        }

        
        socket.on("error_popup", errorPopuop);
 
        return () => {
            socket.off('error_popup', errorPopuop);
        }
    }, []);

  
    
    return  <div>
                <h1>Game {sessionId}</h1>
                <h2>{params.roomId}</h2>
          
                <button onClick={startGame}> Start Game</button>


                { showErrorPopup && (<div> ERORR: {errorMessage}</div>)}
                
            </div>;
};
  
export default Game;