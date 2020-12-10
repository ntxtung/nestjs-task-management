import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const postgresDbConfig: TypeOrmModuleOptions = {
  name: 'postgres_db',
  type: 'postgres',
  host: process.env.PG_DB_HOST || 'localhost',
  port: parseInt(process.env.PG_DB_PORT) || 5432,
  username: process.env.PG_DB_USERNAME || 'postgres',
  password: process.env.PG_DB_PASSWORD || 'postgres',
  database: process.env.PG_DB_DATABASE || 'task-management',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

export default postgresDbConfig;
