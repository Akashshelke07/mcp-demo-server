import sqlite3 from 'sqlite3';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

export const databaseTool = {
  name: 'query_database',
  description: 'Query SQLite database for user data and analytics',
  inputSchema: {
    type: 'object',
    properties: {
      query_type: {
        type: 'string',
        enum: ['select', 'count', 'search'],
        description: 'Type of database query'
      },
      table: {
        type: 'string',
        enum: ['users', 'orders', 'products'],
        description: 'Database table to query'
      },
      filters: {
        type: 'object',
        description: 'Filters to apply to the query'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of records to return',
        default: 10
      }
    },
    required: ['query_type', 'table']
  },

  async execute(args) {
    try {
      logger.info('Executing database tool', args);

      const { query_type, table, filters = {}, limit = 10 } = args;

      // Initialize mock database
      await this.initializeDatabase();

      switch (query_type) {
        case 'select':
          return await this.selectRecords(table, filters, limit);
        
        case 'count':
          return await this.countRecords(table, filters);
        
        case 'search':
          return await this.searchRecords(table, filters, limit);
        
        default:
          throw new Error(`Unknown query type: ${query_type}`);
      }
    } catch (error) {
      logger.error('Database tool execution failed', error);
      throw error;
    }
  },

  async initializeDatabase() {
    // Mock database data (in production, you'd connect to a real database)
    this.mockData = {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, city: 'New York' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, city: 'London' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, city: 'Tokyo' }
      ],
      orders: [
        { id: 1, user_id: 1, product: 'Laptop', amount: 999.99, date: '2024-01-15' },
        { id: 2, user_id: 2, product: 'Phone', amount: 599.99, date: '2024-01-16' },
        { id: 3, user_id: 1, product: 'Mouse', amount: 29.99, date: '2024-01-17' }
      ],
      products: [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
        { id: 2, name: 'Phone', category: 'Electronics', price: 599.99, stock: 100 },
        { id: 3, name: 'Mouse', category: 'Accessories', price: 29.99, stock: 200 }
      ]
    };
  },

  async selectRecords(table, filters, limit) {
    let records = this.mockData[table] || [];

    // Apply filters
    if (Object.keys(filters).length > 0) {
      records = records.filter(record => {
        return Object.entries(filters).every(([key, value]) => {
          return record[key] === value;
        });
      });
    }

    // Apply limit
    records = records.slice(0, limit);

    return {
      success: true,
      data: {
        table,
        records,
        count: records.length,
        total: this.mockData[table]?.length || 0
      },
      message: `Retrieved ${records.length} records from ${table}`
    };
  },

  async countRecords(table, filters) {
    let records = this.mockData[table] || [];

    if (Object.keys(filters).length > 0) {
      records = records.filter(record => {
        return Object.entries(filters).every(([key, value]) => {
          return record[key] === value;
        });
      });
    }

    return {
      success: true,
      data: {
        table,
        count: records.length,
        filters
      },
      message: `Counted ${records.length} records in ${table}`
    };
  },

  async searchRecords(table, filters, limit) {
    let records = this.mockData[table] || [];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      records = records.filter(record => {
        return Object.values(record).some(value => 
          String(value).toLowerCase().includes(searchTerm)
        );
      });
    }

    records = records.slice(0, limit);

    return {
      success: true,
      data: {
        table,
        searchTerm: filters.search,
        records,
        count: records.length
      },
      message: `Found ${records.length} records matching search`
    };
  }
};