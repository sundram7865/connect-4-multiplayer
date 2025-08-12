import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//MultiplayerGame table with fields in the database
const MultiplayerGameModel = sequelize.define(
    'MultiplayerGame', {
        gameId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        datetime: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        firstplayer: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        opponent: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        winner: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }
)

export { MultiplayerGameModel }