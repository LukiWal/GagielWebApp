import React from 'react';
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { generateId } from '../helper/helperFunctions';

const socket = io.connect("http://localhost:8800");





const Game = () => {

    const [roomId, setRoomId] = useState("");
    const [sessionId, setSessionId] = useState("");

    let params = useParams();

    const joinRoom = () => {
        if (roomId !== "") {
            socket.emit("join_room", { roomId: roomId, sessionId: sessionId });
        }
    };

    useEffect(() => {
        if(localStorage.getItem('sessionId') === null){
            const newId = generateId(10, true);
            setSessionId(newId);
            localStorage.setItem('sessionId', JSON.stringify(newId));
        } else{
            const id = localStorage.getItem('sessionId');
            setSessionId(id);
        }      
    }, []);

  
    
    return <div>
                <h1>Game {sessionId}</h1>
                <h2>{params.roomId}</h2>
                <input
                placeholder="Room Number..."
                onChange={(event) => {
                setRoomId(event.target.value);
                }}
                />
                <button onClick={joinRoom}> Join Room</button>
            </div>;
};
  
export default Game;