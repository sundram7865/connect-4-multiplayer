import { DataTypes } from 'sequelize';
import sequelize from '../../config/DatabaseConfig.js';

//Session table with fields in the database
const SessionModel = sequelize.define(
    'Session', {
        sid: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        sess: {
            type: DataTypes.JSON,
            allowNull: false
        },
        expire: {
            type: DataTypes.DATE,
            allowNull: false,
            precision: 6
        }
    }
)

export { SessionModel }