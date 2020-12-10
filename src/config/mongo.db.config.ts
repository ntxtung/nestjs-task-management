import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const { MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_DATABASE } = process.env;
const mongoDbConfig: TypeOrmModuleOptions = {
  name: 'mongo_db',
  type: 'mongodb',
  url: `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_DATABASE}`,
  synchronize: true,
  useUnifiedTopology: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};

export default mongoDbConfig;
