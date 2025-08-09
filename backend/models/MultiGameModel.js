import { DataTypes } from 'sequelize';
import sequelize from '../config/DatabaseConfig.js';

const MultiplayerGameModel = sequelize.define(
    'MultiplayerGame', {
        gameId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
       
        player1: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Users',  
                key: 'username'
            }
        },
        player2: {  
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'username'
            }
        },
   
        status: { 
            type: DataTypes.ENUM('waiting', 'active', 'completed', 'abandoned'),
            defaultValue: 'waiting'
        },
    
        winner: {  
            type: DataTypes.ENUM('player1', 'player2', 'draw'),
            allowNull: true 
        },
     
        startedAt: {  
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        completedAt: { 
            type: DataTypes.DATE,
            allowNull: true
        },
      
        duration: {  
            type: DataTypes.INTEGER,
            allowNull: true
        },
        moveCount: { 
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        
        disconnectedPlayer: { 
            type: DataTypes.ENUM('player1', 'player2'),
            allowNull: true
        },
        lastActivity: {  
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        indexes: [
            
            { fields: ['player1'] },
            { fields: ['player2'] },
            { fields: ['status'] },
            { fields: ['startedAt'] }
        ]
    }
);

export { MultiplayerGameModel };