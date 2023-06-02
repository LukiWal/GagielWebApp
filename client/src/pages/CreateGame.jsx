import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateId } from '../helper/helperFunctions';
import './createGame.scss';

import { socket } from '../helper/socket';



const CreateGame = ({sessionId}) => {

    const [newGameId, setNewGameId] = useState(generateId(6, false));
    const [gameCreated, setGameCreated] = useState(false); 
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);

    let navigate = useNavigate(); 
 
    const createGame = () => {
        if(!gameCreated){
            
            
            setGameCreated(true)
            socket.emit("create_game", { newGameId: newGameId, sessionId: sessionId, numberOfPlayers: numberOfPlayers });

            let path = `/game/`+newGameId; 
            navigate(path);
        }  
    };

    return <div className="createGameContainer playground">
                <h1>Create Game </h1>
                <h3>Game Code: <span className='numberOfPlayers'>{newGameId}</span> <button className="gaigelButton" onClick={() => {navigator.clipboard.writeText(newGameId)}}>Copy Code!</button></h3>
                <h3>Create a game for: <span className='numberOfPlayers'>{numberOfPlayers} Players </span>!</h3>
                <button className="gaigelButton selectPlayerNumberButton" onClick={() => setNumberOfPlayers(2)}>2 Players</button>
                <button className="gaigelButton selectPlayerNumberButton" onClick={() => setNumberOfPlayers(3)}>3 Players</button>
                <button className="gaigelButton selectPlayerNumberButton" onClick={() => setNumberOfPlayers(4)}>4 Players</button>
                <button className="gaigelButton createGameButton" onClick={createGame}> Create Game!</button>

            </div>
  };
  
  export default CreateGame;