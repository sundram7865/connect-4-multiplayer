import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//GameData table with fields in the database
const GameDataModel = sequelize.define(
    'GameData', {
        dataId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey:true,
            unique:true
        },
        gameArray: {
            type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.CHAR)),
            allowNull:false
        },
        firstPlayer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        winning: {
            type: DataTypes.STRING,
            allowNull:true
        },
        playerTurn: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.STRING
        },
        OKClick: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        datetime: {
            type: DataTypes.STRING
        },
        firstPlayerForThisGame: {
            type: DataTypes.STRING
        }
    }
)

export { GameDataModel }