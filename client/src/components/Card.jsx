import React from 'react';

const Card = ({ card, cardPlayedEmit}) => {
    return <div>
        
        <button onClick={() => {cardPlayedEmit(card)}}> Play Card {card} </button>
    
    </div>;
  };
  
export default Card;