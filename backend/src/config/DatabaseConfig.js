import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Neon
        }
    },
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

export default sequelize
