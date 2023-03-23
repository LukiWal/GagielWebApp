import React from 'react';
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';

const socket = io.connect("http://localhost:8800");


const Game = ({sessionId}) => {
    
    let params = useParams();
    const [messageReceived, setMessageReceived] = useState("");

    const sendToAll = () => {
 
        socket.emit("send_all", {gameId: params.roomId, data: "Hi :)"});
        
    };

    useEffect(() => {
        if(sessionId != ''){
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId});
        }
        
    },[{sessionId}] );
    
    useEffect(() => {
        socket.on("recieve", (data) => {
            console.log(data)
            setMessageReceived(data);
        });
    }, [socket]);

  
    
    return  <div>
                <h1>Game {sessionId}</h1>
                <h2>{params.roomId}</h2>
                <h3>Message: {messageReceived}</h3>
                
                <button onClick={sendToAll}> Send to all</button>
            </div>;
};
  
export default Game;