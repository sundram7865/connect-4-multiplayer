import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

// BotGameData table - Stores active bot game states
const BotGameDataModel = sequelize.define(
    'BotGameData', {
        dataId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        
        gameBoard: {  
            type: DataTypes.JSON, 
            defaultValue: () => Array(6).fill(null).map(() => Array(7).fill(null)),
            allowNull: false
        },
        playerUsername: {  
            type: DataTypes.STRING,
            allowNull: false
        },
        winner: {  
            type: DataTypes.ENUM('player', 'bot'),
            allowNull: true
        },
        currentTurn: {  
            type: DataTypes.ENUM('player', 'bot'),
            defaultValue: 'player',
            allowNull: false
        },
        botDifficulty: { 
            type: DataTypes.ENUM('easy', 'medium', 'hard'),
            defaultValue: 'medium'
        },
        isReady: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        startedAt: {  
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }
);

export { BotGameDataModel };
