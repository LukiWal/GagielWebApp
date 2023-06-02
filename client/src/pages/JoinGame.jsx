import React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';

const JoinGame = () => {
    const [roomId, setRoomId] = useState("");

    return  <div>

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