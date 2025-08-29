import fs from 'fs/promises';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

export const logsResource = {
  uri: 'logs://system',
  name: 'System Logs',
  description: 'Access system logs and error reports',
  mimeType: 'application/json',

  async read() {
    try {
      logger.info('Reading system logs resource');

      const logsData = await this.getLogsData();
      
      return {
        contents: [{
          uri: this.uri,
          mimeType: this.mimeType,
          text: JSON.stringify(logsData, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Failed to read logs resource', error);
      throw error;
    }
  },

  async getLogsData() {
    try {
      // Try to read from file, fallback to mock data
      const data = await fs.readFile(config.logsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.warn('Using mock logs data', error.message);
      return this.getMockLogsData();
    }
  },

  getMockLogsData() {
    const now = new Date();
    return {
      logs: [
        {
          id: 1,
          timestamp: new Date(now.getTime() - 3600000).toISOString(),
          level: 'info',
          service: 'api',
          message: 'Server started successfully',
          metadata: { port: 3000 }
        },
        {
          id: 2,
          timestamp: new Date(now.getTime() - 1800000).toISOString(),
          level: 'warn',
          service: 'database',
          message: 'Connection pool running low',
          metadata: { available: 2, total: 10 }
        },
        {
          id: 3,
          timestamp: new Date(now.getTime() - 900000).toISOString(),
          level: 'error',
          service: 'auth',
          message: 'Failed login attempt',
          metadata: { ip: '192.168.1.100', attempts: 3 }
        }
      ],
      summary: {
        total: 3,
        levels: {
          info: 1,
          warn: 1,
          error: 1
        }
      },
      lastUpdated: now.toISOString()
    };
  }
};