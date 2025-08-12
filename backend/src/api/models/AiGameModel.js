import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//AiGame table with fields in the database
const AiGameModel = sequelize.define(
    'AiGame', {
        gameId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        level: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        firstplayer: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        winner: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        datetime: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }
)

export { AiGameModel }