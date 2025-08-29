import fs from 'fs/promises';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

export const profilesResource = {
  uri: 'profiles://users',
  name: 'User Profiles',
  description: 'Access user profile data and preferences',
  mimeType: 'application/json',

  async read() {
    try {
      logger.info('Reading user profiles resource');

      const profilesData = await this.getProfilesData();
      
      return {
        contents: [{
          uri: this.uri,
          mimeType: this.mimeType,
          text: JSON.stringify(profilesData, null, 2)
        }]
      };
    } catch (error) {
      logger.error('Failed to read profiles resource', error);
      throw error;
    }
  },

  async getProfilesData() {
    try {
      const data = await fs.readFile(config.profilesPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.warn('Using mock profiles data', error.message);
      return this.getMockProfilesData();
    }
  },

  getMockProfilesData() {
    return {
      profiles: [
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          },
          stats: {
            loginCount: 45,
            lastLogin: new Date().toISOString(),
            accountCreated: '2024-01-01T00:00:00Z'
          }
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com',
          preferences: {
            theme: 'light',
            notifications: false,
            language: 'en'
          },
          stats: {
            loginCount: 23,
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
            accountCreated: '2024-01-15T00:00:00Z'
          }
        }
      ],
      metadata: {
        totalUsers: 2,
        activeUsers: 2,
        lastUpdated: new Date().toISOString()
      }
    };
  }
};