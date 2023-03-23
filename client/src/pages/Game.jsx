import React from 'react';
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';

const socket = io.connect("http://localhost:8800");





const Game = ({sessionId}) => {
    
    let params = useParams();


    useEffect(() => {
        if(sessionId != ''){
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId});
        }
        
    },[{sessionId}] );
    
    

  
    
    return  <div>
                <h1>Game {sessionId}</h1>
                <h2>{params.roomId}</h2>
               
                
            </div>;
};
  
export default Game;