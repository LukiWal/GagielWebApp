import React from 'react';
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8800");


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


const Game = () => {

    const [room, setRoom] = useState("");

    const joinRoom = () => {
        if (room !== "") {
            const sessionId = localStorage.getItem('sessionId');
            socket.emit("join_room", room);
        }
    };

    useEffect(() => {
            if(localStorage.getItem('sessionId') === null){
                const id = makeid(10);
                localStorage.setItem('sessionId', JSON.stringify(id));
            }   
    }, []);

    
    
    
    
    return <div>
                <h1>Game</h1>
                <input
                placeholder="Room Number..."
                onChange={(event) => {
                setRoom(event.target.value);
                }}
                />
                <button onClick={joinRoom}> Join Room</button>
            </div>;
};
  
export default Game;