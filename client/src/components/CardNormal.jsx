import React from 'react';
import './card.scss';


const CardNormal = ({card, width, height}) => {
    let cardNumber = card.split(":").pop().split('_')[1];
    let cardColor = card.split(":").pop().split('_')[0];

    let cardColorUrl = "";

    switch(cardColor) {
      case "H":
        cardColorUrl = "/herz.svg"
        break;
      case "B":
        cardColorUrl = "/gras.svg"
        break;
      case "S":
        cardColorUrl = "/schellen.svg"
        break;
      case "E":
        cardColorUrl = "/eichel.svg"
        break;
      default:
        cardColorUrl = "/hearth.svg"
    }
    return <div className="card" style={{height: height, width: width}}> 
        <button>
          <img class="symbol symbol-top" src={cardColorUrl}></img>
          <img class="symbol symbol-bottom" src={cardColorUrl}></img>
          <h3 class="number number-top">{cardNumber}</h3>
          <h3 class="number number-bottom">{cardNumber}</h3>
        </button>
    </div>;
  };
  
export default CardNormal;