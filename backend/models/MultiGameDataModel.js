import { DataTypes } from 'sequelize';
import sequelize from '../config/DatabaseConfig.js';

const GameDataMModel = sequelize.define(
    'GameDataM', {
        dataId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },

       
        gameBoard: {  
            type: DataTypes.JSON, 
            defaultValue: Array(6).fill().map(() => Array(7).fill(null)),
            allowNull: false
        },
        status: {  
            type: DataTypes.ENUM('waiting', 'active', 'completed', 'abandoned'),
            defaultValue: 'waiting'
        },


        player1: {  
            type: DataTypes.STRING,
            allowNull: false
        },
        player2: {  
            type: DataTypes.STRING,
            allowNull: true
        },
        playerTurn: {  
            type: DataTypes.STRING,
            allowNull: true
        },

       
        isReady: {  
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        playClick: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

       
        winner: {  
            type: DataTypes.ENUM('player1', 'player2', 'draw'),
            allowNull: true
        },
        winningCombination: {  
            type: DataTypes.JSON,
            allowNull: true
        },

      
        createdAt: {  
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        timeControl: {  
            type: DataTypes.JSON,
            allowNull: false
        },

        chatMessages: { 
            type: DataTypes.ARRAY(DataTypes.JSON),
            defaultValue: []
        },

      
        playAgainStatus: {  
            type: DataTypes.ENUM('none', 'player1', 'player2', 'both'),
            defaultValue: 'none'
        },

       
        playerStates: {
            type: DataTypes.JSON,
            defaultValue: {
                player1: { ready: false, disconnected: false },
                player2: { ready: false, disconnected: false }
            }
        }
    }
);

export { GameDataMModel };