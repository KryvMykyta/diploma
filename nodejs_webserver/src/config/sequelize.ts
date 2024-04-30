import { Sequelize } from 'sequelize-typescript';
import models from '@models/index';
import config from '@config/variables';

// const sequelize = new Sequelize(config.RATINGS_DB_CONN_URI, {models})
const sequelize = new Sequelize({
    host: config.MYSQL_HOST,
    port: 3306,
    dialect: 'mysql',
    database: config.MYSQL_DATABASE,
    username: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    models
})

export default sequelize