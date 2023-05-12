import React from 'react';
import './player.scss';


const Player = ({points, imageId, playersTurn}) => {
    let playerPictureUrl = "/playerImg-" +String(imageId) +".jpg"

    return <div className={"player "  + (playersTurn && 'playersTurn')}> 
                <div className="imageWrapper">
                    <img class="" src={playerPictureUrl}></img>
                </div>
                <div className="points">
                    {points} 
                </div>
           </div>;
  };
  
export default Player;