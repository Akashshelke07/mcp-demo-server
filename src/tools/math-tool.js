import { logger } from '../utils/logger.js';

export const mathTool = {
  name: 'calculate_math',
  description: 'Perform mathematical calculations and operations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt', 'factorial'],
        description: 'Mathematical operation to perform'
      },
      numbers: {
        type: 'array',
        items: { type: 'number' },
        description: 'Numbers to operate on'
      },
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate (alternative to operation+numbers)'
      }
    },
    oneOf: [
      { required: ['operation', 'numbers'] },
      { required: ['expression'] }
    ]
  },

  async execute(args) {
    try {
      logger.info('Executing math tool', args);

      if (args.expression) {
        return this.evaluateExpression(args.expression);
      }

      const { operation, numbers } = args;
      
      if (!numbers || numbers.length === 0) {
        throw new Error('Numbers array cannot be empty');
      }

      const result = await this.performOperation(operation, numbers);
      
      return {
        success: true,
        data: {
          operation,
          numbers,
          result,
          formatted: `${operation}(${numbers.join(', ')}) = ${result}`
        },
        message: `Successfully calculated ${operation}`
      };
    } catch (error) {
      logger.error('Math tool execution failed', error);
      throw error;
    }
  },

  async performOperation(operation, numbers) {
    switch (operation) {
      case 'add':
        return numbers.reduce((sum, num) => sum + num, 0);
      
      case 'subtract':
        return numbers.reduce((diff, num) => diff - num);
      
      case 'multiply':
        return numbers.reduce((product, num) => product * num, 1);
      
      case 'divide':
        if (numbers.includes(0) && numbers.indexOf(0) !== 0) {
          throw new Error('Cannot divide by zero');
        }
        return numbers.reduce((quotient, num) => quotient / num);
      
      case 'power':
        if (numbers.length !== 2) {
          throw new Error('Power operation requires exactly 2 numbers');
        }
        return Math.pow(numbers[0], numbers[1]);
      
      case 'sqrt':
        if (numbers.length !== 1) {
          throw new Error('Square root requires exactly 1 number');
        }
        if (numbers[0] < 0) {
          throw new Error('Cannot calculate square root of negative number');
        }
        return Math.sqrt(numbers[0]);
      
      case 'factorial':
        if (numbers.length !== 1) {
          throw new Error('Factorial requires exactly 1 number');
        }
        return this.factorial(numbers[0]);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  },

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('Factorial requires a non-negative integer');
    }
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  },

  evaluateExpression(expression) {
    // Simple expression evaluator (be careful with eval in production!)
    try {
      // Sanitize expression to only allow numbers and basic operators
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      if (sanitized !== expression) {
        throw new Error('Expression contains invalid characters');
      }
      
      const result = Function(`"use strict"; return (${sanitized})`)();
      
      return {
        success: true,
        data: {
          expression,
          result,
          formatted: `${expression} = ${result}`
        },
        message: 'Expression evaluated successfully'
      };
    } catch (error) {
      throw new Error(`Invalid expression: ${error.message}`);
    }
  }
};