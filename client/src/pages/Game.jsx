import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';




const Game = ({sessionId}) => {
    
    let params = useParams();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [messageReceived, setMessageReceived] = useState("");

    const sendToAll = () => {
 
        socket.emit("send_all", {gameId: params.roomId, data: "Hi :)"});
        
    };

    useEffect(() => {
        if(sessionId != ''){
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId});
        }
        
    },[] );
    
    useEffect(() => {
        socket.on("receive", (data) => {
            setMessageReceived(data);
        });

        socket.on("error_popup", (data) => {
            console.log("error popup")
            setShowErrorPopup(true);
            setErrorMessage(data);
        });
    }, [socket]);

  
    
    return  <div>
                <h1>Game {sessionId}</h1>
                <h2>{params.roomId}</h2>
                <h3>Message: {messageReceived}</h3>
                

                { showErrorPopup && (<div> ERORR: {errorMessage}</div>)}
                <button onClick={sendToAll}> Send to all</button>
            </div>;
};
  
export default Game;