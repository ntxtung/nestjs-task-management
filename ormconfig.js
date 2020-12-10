// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  // name: 'postgres_db',
  type: 'postgres',
  host: process.env.PG_DB_HOST || 'localhost',
  port: parseInt(process.env.PG_DB_PORT) || 5432,
  username: process.env.PG_DB_USERNAME || 'postgres',
  password: process.env.PG_DB_PASSWORD || 'postgres',
  database: process.env.PG_DB_DATABASE || 'taskmanagement',
  entities: ['src/**/**.entity.{js,ts}'],
  // synchronize: true, // Unsafe
  // migrationsTableName: process.env.PG_DB_DATABASE || 'task-management',
  migrations: ['src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
