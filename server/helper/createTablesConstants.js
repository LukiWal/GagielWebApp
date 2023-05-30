const CREATE_GAMES_TABLE = "CREATE TABLE IF NOT EXISTS `games` ( \
  `id` int NOT NULL AUTO_INCREMENT, \
  `gameId` varchar(45) NOT NULL, \
  `player1` int DEFAULT NULL, \
  `player2` int DEFAULT NULL, \
  `player3` int DEFAULT NULL, \
  `player4` int DEFAULT NULL, \
  `gameStarted` tinyint DEFAULT '0', \
  `maxPlayers` tinyint DEFAULT '3', \
  `deckOfCards` varchar(800) DEFAULT NULL, \
  `trumpCard` varchar(45) DEFAULT NULL, \
  PRIMARY KEY (`id`), \
  KEY `playerId_idx1` (`player1`,`player2`,`player3`,`player4`), \
  KEY `playerId_idx2` (`player3`), \
  KEY `palyerId_idx1` (`player4`) \
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"



const CREATE_PLAYERS_TABLE = "CREATE TABLE IF NOT EXISTS `players` ( \
  `playerId` int NOT NULL AUTO_INCREMENT, \
  `sessionId` varchar(45) DEFAULT NULL, \
  `gameId` varchar(45) DEFAULT NULL, \
  `socketId` varchar(45) DEFAULT NULL, \
  `cards` varchar(80) DEFAULT NULL, \
  `points` int DEFAULT '0', \
  `trick` tinyint DEFAULT '0', \
  `meldedCards` varchar(100) DEFAULT NULL, \
  PRIMARY KEY (`playerId`), \
  UNIQUE KEY `index2` (`sessionId`,`gameId`) \
) ENGINE=InnoDB AUTO_INCREMENT=313 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"


const CREATE_ROUNDS_TABLE = "CREATE TABLE IF NOT EXISTS `rounds` ( \
  `id` int NOT NULL AUTO_INCREMENT, \
  `gameId` varchar(45) DEFAULT NULL, \
  `playerToBeginn` int DEFAULT NULL, \
  `card1` varchar(45) DEFAULT NULL, \
  `card2` varchar(45) DEFAULT NULL, \
  `card3` varchar(45) DEFAULT NULL, \
  `card4` varchar(45) DEFAULT NULL, \
  PRIMARY KEY (`id`) \
) ENGINE=InnoDB AUTO_INCREMENT=849 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
 

module.exports = {
  CREATE_GAMES_TABLE,
  CREATE_PLAYERS_TABLE,
  CREATE_ROUNDS_TABLE
}