import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//User table with fields in the database
const UserModel = sequelize.define(
    'User', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        aiGames: {
            type: DataTypes.JSON
        },
        multiplayerGames: {
            type: DataTypes.JSON
        }
    }
)

export { UserModel }