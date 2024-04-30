import dotenv from "dotenv";
dotenv.config();

const config = {
    RATINGS_DB_CONN_URI: process.env.RATINGS_DB_CONN_URI,
    SECRET_AUTH_KEY: process.env.SECRET_AUTH_KEY,
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_HOST: process.env.MYSQL_HOST
}

export default config