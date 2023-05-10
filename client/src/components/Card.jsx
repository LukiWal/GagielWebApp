import React from 'react';
import './card.scss';


const Card = ({ card, cardPlayedEmit}) => {
    return <div className="card"> 
        <button onClick={() => {cardPlayedEmit(card)}}> Play Card {card} </button>
        <img class="symbol symbol-top" src="/hearth.svg"></img>
        <img class="symbol symbol-bottom" src="/hearth.svg"></img>
        <h3 class="number number-top">10</h3>
        <h3 class="number number-bottom">10</h3>
    </div>;
  };
  
export default Card;