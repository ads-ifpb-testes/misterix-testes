import { Sequelize } from "sequelize";
import {defineModels, syncModels} from "./models.js";
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: 'postgis',
        dialect: 'postgres',
    }
);

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connect();
defineModels(sequelize);
syncModels(sequelize);

export default sequelize;