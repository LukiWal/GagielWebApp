# GaigelWebApp
The Gaigel Web App is an online platform for playing the card game Gaigel. It allows users to enjoy the game with friends or other players from around the world, directly in their web browser.

## Technologies Used

Frontend: React, Scss, JavaScript, Socket I.O.

Backend: JavaScript, Node.Js, Socket I.O.

Database: MySQL

## Requirements 
[NPM](https://www.npmjs.com)

[Node JS](https://nodejs.org/en)

[MySQL](https://www.mysql.com)

## Installation
Clone the Project in a Folder

Run `npm install` in Root directory of the app  

Modify the .env File in the server/ directory with your MySQL User and Password

`DB_USER= "YourUsername"`

`DB_PASSWORD="YourPassword"`

**NOTE:** If you want to use a other Node JS Port you have to modify the Port in the .env and in the client/helper/socket.js `NODE_JS_PORT` constant

## Start the App

Run `npm run start-server` in a CLI Terminal

Run `npm run start-client` in a second CLI Terminal

## How to play

First you have to create a game by navigating to `http://localhost:3000/create`. After the creation you can join the game by navigation to `http://localhost:3000/game/**Game Code**`. Exhange **Game Code** with the Code of the game you have created. 

**NOTE:** You cannot join the same game using the same web browser. If you want to join the game again, you need to use a different browser or open a private browsing window in the same browser.

The Web App uses Session IDs stored in the local storage to identify users. These Session IDs are the same across all tabs in the browser. A User cannot join the same game twice.
