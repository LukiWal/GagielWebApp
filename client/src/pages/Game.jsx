import React from 'react';
import { useEffect, useState } from "react";
import { socket } from '../helper/socket';
import { useParams } from "react-router-dom";
import Card from '../components/Card';
import CardNormal from '../components/CardNormal'
import Player from '../components/Player';
import './game.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Game = ({sessionId}) => {
    
    let params = useParams();

    const [playerCards, setPlayerCards] = useState([]);
    const [playerPoints, setPlayerPoints] = useState("");
    const [currentCards, setCurrentCards] = useState([]);
    const [trumpCard, setTrumpCard] = useState("");
    const [playersTurn, setPlayersTurn] = useState(false);

    const [cardHeight, setCardHeight] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    const [playerArray, setPlayerArray] = useState([]);
    const [enemyPoints, setEnemyPoints] = useState([0,0,0]);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [playersTurn2, setPlayersTurn2] = useState(0);
    const [playerWon, setPlayerWon] = useState(0);



    const startGame = () => {
        socket.emit("start_game", { gameId: params.roomId});
    };

    const meldCard = (card) => {
        socket.emit("meld_card", { card, gameId: params.roomId, sessionId: sessionId});
    };

    const exchangeTrump = () =>{
        socket.emit("exchange_trump", {gameId: params.roomId, sessionId: sessionId});
    }

    

    useEffect(() => {
        console.log("JOIN ROOM")
    
        if(sessionId){
            console.log("SessionId: " +sessionId)
            
            socket.emit("join_room", { gameId: params.roomId, sessionId: sessionId}, function(){
                /* socket.emit("load_game", { gameId: params.roomId }) */
            }); 
        } 
    },[] );
    
    useEffect(() => {
        function notify (message) {
            console.log("NOTIFY ME")
            toast(message);
        }

        function startGameData(data){
            if(data.playerCards) setPlayerCards(data.playerCards);
            if(data.playerPoints) setPlayerPoints(data.playerPoints);
            if(data.trumpCard) setTrumpCard(data.trumpCard);
            if(data.playersTurn) setPlayersTurn(data.playersTurn);
            if(data.currentCards) setCurrentCards(data.currentCards);
            if(data.playerArray) setPlayerArray(data.playerArray)
        }
    
        socket.on("error_popup", notify);
        socket.on("load_start_game", startGameData);

        return () => {
            socket.off('error_popup', notify);
            socket.off("load_start_game", startGameData);
        }
    }, []);

  
    const cardPlayedEmit = (card) => {
        socket.emit("play_card", {gameId: params.roomId, sessionId: sessionId, card: card}, function(){
            setPlayersTurn(false) 
        });
    
    }

    let listItems = null;
    

    if(playerCards.length > 0){
        var playerCardsVar = playerCards
        listItems = playerCardsVar.map((card) => <Card key={card} width={cardWidth} height={cardHeight} card={card} cardPlayedEmit={cardPlayedEmit}></Card>);
    } 
    
    let currentCardsList = null;

    if(currentCards.length > 0){
        var currentCardsVar = currentCards;
        console.log(currentCards)
        currentCardsList = currentCardsVar.map((card) => <CardNormal key={card} card={card}></CardNormal>);
    } 

    
    const size = useWindowSize();

    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
        useEffect(() => {
          function handleResize() {
           
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
         
          window.addEventListener("resize", handleResize);
      
          handleResize();
      
          return () => window.removeEventListener("resize", handleResize);
        }, []); 
        return windowSize;
    }

    useEffect(() => {
        const ASPECT_RATIO = 1.6;
        let maxWidthCard = size.width * 0.95 * 0.9 * (1 / playerCards.length);
        let maxHeightCard = size.height * 0.3 * 0.95;

        let width = maxWidthCard;
        let height = maxWidthCard * ASPECT_RATIO;

        if(height>maxHeightCard){
            width = maxHeightCard / ASPECT_RATIO;
            height = maxHeightCard;
        }
        
        setCardWidth(width);
        setCardHeight(height);   
    },[size, playerCards] );

    return  <div className='playground'>
{               /* <h1>Game {params.roomId} </h1>
                <h2>Session ID: {sessionId}</h2> */}
          
              
                          
                
               <div className="gameControllsWrapper">

               </div>
               
                <div className="otherPlayersWrapper">
                    <Player points={20} imageId={1} hasWonBool={false} />
                    <h3>Trumpf Karte: {trumpCard}</h3>
                    <Player points={20} imageId={1} hasWonBool={false} />
                </div>
                <div className='currentCardsWrapper'>
                    <div className="currentCards">
                        {currentCardsList}
                        <h2>{playerArray}</h2>
                    </div>
                </div>
                <div className="playerControllsWrapper">
                    {playerPoints}
                    <h3>Spieler an der Reihe: { playersTurn && ( "YES")}</h3>
                    <button onClick={() => {startGame()}}> Start Game</button>
                    <button onClick={() => {exchangeTrump()}}> Tausch Trumpf</button>
                </div>           
                <div className='playerCardsWrapper'>
                    <div className="playerCards"> 
                        {listItems}
                    </div>
                </div>
                
               

                <ToastContainer />
            </div>;
};
  
export default Game;