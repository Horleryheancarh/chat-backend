import { Sequelize } from 'sequelize';
import { DB_NAME, DB_USER, DB_HOST, DB_PORT, DB_PASS, NODE_ENV } from '../config';

const sequelize = new Sequelize(
  DB_NAME!,
  DB_USER!,
  DB_PASS!,
  {
    host: DB_HOST!,
    port: DB_PORT!,
    dialect: 'mysql',
    logging: NODE_ENV === 'development'
  }
);

export { sequelize };
