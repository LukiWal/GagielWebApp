import React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';

const JoinGame = () => {
    const [roomId, setRoomId] = useState("");

    return  <div className="createGameContainer fullheightContainer centerContainer">
                <h1>Join Game</h1>
                <input
                    placeholder="Room Number..."
                    onChange={(event) => {
                    setRoomId(event.target.value);
                    }}
                ></input>
                <Link className="gaigelButton" to={'/game/' + roomId}>Join Game</Link>
            </div>;
  };
  
  export default JoinGame;