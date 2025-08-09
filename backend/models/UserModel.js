import { DataTypes } from 'sequelize';
import sequelize from '../config/DatabaseConfig.js';

const UserModel = sequelize.define(
    'User', {
        username: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9_]+$/
            }
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: ''
        },
        avatar: {
            type: DataTypes.STRING(2048),
            allowNull: false,
            defaultValue: '/default-avatar.png'
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        stats: {
            type: DataTypes.JSON,
            defaultValue: {
                wins: 0,
                losses: 0,
                draws: 0,
                rating: 1000
            }
        },
        refreshToken: {
            type: DataTypes.STRING(512),
            allowNull: true
        },
        settings: {
            type: DataTypes.JSON,
            defaultValue: {
                theme: 'light',
                soundEnabled: true,
                matchPreferences: {
                    autoMatch: true,
                    preferredDifficulty: 'medium'
                }
            }
        }
    },
    {
        indexes: [
            { fields: ['email'] },
            { fields: ['displayName'] },
            { fields: ['stats.rating'] }
        ],
        timestamps: true
    }
);

export { UserModel };