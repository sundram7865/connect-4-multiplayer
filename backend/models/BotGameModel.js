import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

// BotGame table - Stores completed bot game records
const BotGameModel = sequelize.define(
    'BotGame', {  
        gameId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        
        botDifficulty: {
            type: DataTypes.ENUM('easy', 'medium', 'hard'),
            allowNull: false
        },
        playerUsername: {  
            type: DataTypes.STRING,
            allowNull: false
        },
        winner: {
            type: DataTypes.ENUM('player', 'bot', 'draw'),  
            allowNull: false
        },

        completedAt: { 
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
     
        moveCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        gameDuration: {  
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        indexes: [
           
            { fields: ['playerUsername'] },
            { fields: ['winner'] },
            { fields: ['completedAt'] }
        ]
    }
)

export { BotGameModel }  