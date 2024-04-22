import { Sequelize } from "sequelize";

const db = new Sequelize('auth_db', 'sa','12345',{
    host: "localhost",
    dialect: "mssql"
});

export default db;