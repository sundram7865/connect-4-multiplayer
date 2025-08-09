import { DataTypes } from 'sequelize';
import sequelize from '../config/DatabaseConfig.js';

const SessionModel = sequelize.define(
    'Session', {
        sid: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
      
        sessionData: {  
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {
                userId: null,
                gameId: null,      
                socketId: null,    
                lastActivity: null,  
                userAgent: null      
            }
        },
        expire: {
            type: DataTypes.DATE,
            allowNull: false,
            precision: 6
        },

        ipAddress: {
            type: DataTypes.STRING(45), 
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    },
    {
        indexes: [
         
            { fields: ['expire'] },
         
            { fields: [sequelize.json('sessionData.userId')] },
           
            { fields: [sequelize.json('sessionData.gameId')] }
        ]
    }
);

export { SessionModel };