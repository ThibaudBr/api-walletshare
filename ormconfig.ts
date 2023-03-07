module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST_DEV,
  port: process.env.TYPEORM_PORT_DEV,
  username: process.env.TYPEORM_USERNAME_DEV,
  password: process.env.TYPEORM_PASSWORD_DEV,
  database: process.env.TYPEORM_DATABASE_DEV,
  synchronize: process.env.TYPEORM_SYNCHRONIZE_DEV === 'true',
  logging: process.env.TYPEORM_LOGGING_DEV === 'true',
  entities: ['src/**/*.entity.ts'], // Remplacez le chemin par celui de vos entités
  migrations: ['migrations/*.ts'], // Remplacez le chemin par celui de vos migrations
  cli: {
    migrationsDir: '/migrations', // Remplacez le chemin par celui de votre dossier de migrations
  },
};
