import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//GameDataM table with fields in the database
const GameDataMModel = sequelize.define(
    'GameDataM', {
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
        winningM: {
            type: DataTypes.STRING,
            allowNull:true
        },
        playerTurn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        playerTurnUsername: {
            type: DataTypes.STRING,
            allowNull: true
        },
        OKClickM: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        datetime: {
            type: DataTypes.STRING
        },
        firstPlayerForThisGame: {
            type: DataTypes.STRING
        },
        winner: {
            type: DataTypes.STRING
        },
        opponent: {
            type: DataTypes.STRING
        },
        playAgainText: {
            type: DataTypes.STRING
        },
        noPlayAgain: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        time: {
            type: DataTypes.JSON,
            allowNull: false
        },
        chatMessages: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        },
        playing: {
            type: DataTypes.JSON,
            allowNull: false
        },
        p1: {
            type: DataTypes.JSON,
            allowNull: true
        },
        p2: {
            type: DataTypes.JSON,
            allowNull: true
        },
        playClick: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }
)

export { GameDataMModel }