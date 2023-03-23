import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { generateId } from '../helper/helperFunctions';

const socket = io.connect("http://localhost:8800");

const CreateGame = ({sessionId}) => {

    const [newGameId, setNewGameId] = useState(generateId(6, false));
    const [gameCreated, setGameCreated] = useState(false); 

    let navigate = useNavigate(); 
 
    const createGame = () => {
 
        if(!gameCreated){
            socket.emit("create_game", { newGameId: newGameId, sessionId: sessionId });
            
            setGameCreated(true)
            let path = `/game/`+newGameId; 
            navigate(path);
        }
        
    };

    return <div>
                <h1>Create Game {newGameId}</h1>
            
              
                <button onClick={createGame}> Join Room</button>

            </div>
  };
  
  export default CreateGame;