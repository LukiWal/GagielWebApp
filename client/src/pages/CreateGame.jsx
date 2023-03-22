import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { generateId } from '../helper/helperFunctions';

const socket = io.connect("http://localhost:8800");

const CreateGame = () => {

    const [newGameId, setNewGameId] = useState(generateId(6, false));


    let navigate = useNavigate(); 
 
    const createGame = () => {
 
        socket.emit("create_game", { newGameId: newGameId });

        let path = `/game/`+newGameId; 
        navigate(path);
    };

    return <div>
                <h1>Create Game {newGameId}</h1>
            
              
                <button onClick={createGame}> Join Room</button>

                <Link
                    style={{ display: "block", margin: "1rem 0" }}
                    to={`/game/123456`}
                >
                    Create Game
                </Link>
        </div>;
  };
  
  export default CreateGame;