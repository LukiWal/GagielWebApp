import React from 'react';
import './general.scss';
import { ToastContainer, toast } from 'react-toastify';

const Gamerules = () => {

  const notify = () => {
    toast.dismiss();
    toast.warn("This site is under construction. Come back later!");
  }

    return <div className=''>
      <div className='marginContainer verticalCenterContainer fullheightContainer'>
        <h1>Gamerules</h1>

        <p>The Gaigel app is designed for two to four players. The rules are defined the same way for any number of players.</p>
      
        <button onClick={() => notify()} className='gaigelButton'>Tutorial!</button>
        
        <a href="/play">
          <button className='gaigelButton'>Play!</button>
        </a>
        <h3>The following rules have been implemented in the Gaigel app.</h3>


        <h3>Deck Setup</h3>
        <p>The deck consists of two sets of 24 playing cards each. Each card set contains seven different cards of the four different suits.</p>
        <p>Figure 2.1: Setup of a card set from the Württemberg deck.</p>

        <p>From the table, you can read both the setup of a card set and the ranking order of the cards. 
        The Ace (A) beats the Ten (10), the Ten beats the King (K), the Ober (O) beats the Unter (U), 
        and finally, the Unter beats the Seven (7).</p>

        <h3>Game Start</h3>
        <p>At the beginning of the game, each player is dealt five random cards from the entire deck. 
        The starting player is determined randomly. The remaining undealt cards are referred to as the "talon." 
        The last card of the talon is placed face-up on the playing field and sets the trump suit for this round.</p>

        <h3>Game Flow</h3>
        <p>The starting player plays a card of their choice on the playing field. 
          Then, all players take turns playing a card in sequence. Once all cards have been played, the played cards are evaluated. 
          The first card determines the leading suit. 
          The player who played the highest card of this suit at the end of a round wins the round (also known as a "trick").</p>

        <p>An exception to this rule is a trump card, which beats all other suits and can only be beaten by a higher trump card.</p>
        <p>Figure 2.2: Evaluation of individual cards.</p>

        <p>The player who wins a trick gets to start the next round.</p>

        <p>After completing a round, each player draws a card so that they have five cards in hand again.</p>

        <h3>Scoring</h3>
        <p>The goal of Gaigel is to reach 101 points (also known as "eyes"). When a player wins a trick, they receive all the points from the cards played in that round.</p>
        <p>The table on the right shows the point values for each suit.</p>

        <h3>Special Rules</h3>
        <h4>Melding</h4>
        <p>If a player has already won a trick in the entire game and has a pair of the same suit (King and Ober) in their hand, they can meld it.
           This is done by playing one of the two cards. For a regular pair, the player receives an additional 20 points, and for a trump pair, 40 points.</p>

        <h4>Robbing</h4>
        <p>If a player has a trump Seven in hand, they can exchange it with the trump card discarded at the beginning of the game.
           Again, the player must have already won a trick to do this.</p>

        <h4>Exhausting the Talon</h4>
        <p>When all cards from the talon have been distributed, each player must follow the suit played if they have a card of that suit in hand. 
          If they do not have a card of the same suit, they must play a trump card. If they don't have a trump card either, they can play any card.</p>
      </div>

      <ToastContainer 
                position="top-center"
                autoClose={2000}
      />
    </div>; 
  };
  
  export default Gamerules;