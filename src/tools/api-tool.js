import fetch from 'node-fetch';
import { logger } from '../utils/logger.js';

export const apiTool = {
  name: 'fetch_api_data',
  description: 'Fetch data from external APIs (weather, news, etc.)',
  inputSchema: {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint type (weather, news, quote)'
      },
      params: {
        type: 'object',
        description: 'Parameters for the API call',
        properties: {
          city: { type: 'string' },
          country: { type: 'string' }
        }
      }
    },
    required: ['endpoint']
  },

  async execute(args) {
    try {
      const { endpoint, params = {} } = args;
      
      logger.info('Executing API tool', { endpoint, params });

      switch (endpoint) {
        case 'weather':
          return await this.fetchWeather(params.city || 'London');
        
        case 'quote':
          return await this.fetchRandomQuote();
        
        case 'news':
          return await this.fetchNews();
        
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }
    } catch (error) {
      logger.error('API tool execution failed', error);
      throw error;
    }
  },

  async fetchWeather(city) {
    // Mock weather data (replace with real API)
    const mockWeather = {
      city,
      temperature: Math.floor(Math.random() * 30) + 5,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 20)
    };
    
    return {
      success: true,
      data: mockWeather,
      message: `Weather data for ${city}`
    };
  },

  async fetchRandomQuote() {
    const quotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "Stay hungry, stay foolish.", author: "Steve Jobs" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return {
      success: true,
      data: randomQuote,
      message: "Random inspirational quote"
    };
  },

  async fetchNews() {
    // Mock news data
    const mockNews = [
      {
        title: "Tech Industry Continues to Grow",
        summary: "Latest developments in AI and machine learning",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Climate Change Updates",
        summary: "New research on renewable energy solutions",
        publishedAt: new Date().toISOString()
      }
    ];

    return {
      success: true,
      data: mockNews,
      message: "Latest news headlines"
    };
  }
};