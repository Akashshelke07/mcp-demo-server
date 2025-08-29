import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',
  weatherApiKey: process.env.WEATHER_API_KEY,
  databasePath: process.env.DATABASE_PATH || './data/database.db',
  logsPath: process.env.LOGS_PATH || './data/logs.json',
  profilesPath: process.env.PROFILES_PATH || './data/profiles.json'
};