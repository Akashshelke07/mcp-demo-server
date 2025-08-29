export const prompts = {
  'analyze_data': {
    name: 'analyze_data',
    description: 'Analyze data from various sources with structured output',
    arguments: [
      {
        name: 'data_source',
        description: 'Source of data to analyze (logs, profiles, api)',
        required: true
      },
      {
        name: 'analysis_type',
        description: 'Type of analysis (summary, trends, errors)',
        required: true
      }
    ],
    
    async generate(args) {
      const { data_source, analysis_type } = args;
      
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please analyze the ${data_source} data and provide a ${analysis_type} analysis. 
                     Focus on key insights, patterns, and actionable recommendations.
                     
                     Structure your response as:
                     1. Executive Summary
                     2. Key Findings
                     3. Detailed Analysis
                     4. Recommendations
                     5. Next Steps`
            }
          }
        ]
      };
    }
  },

  'generate_report': {
    name: 'generate_report',
    description: 'Generate comprehensive reports with data visualization suggestions',
    arguments: [
      {
        name: 'report_type',
        description: 'Type of report (performance, user_activity, system_health)',
        required: true
      },
      {
        name: 'time_period',
        description: 'Time period for the report (daily, weekly, monthly)',
        required: false
      }
    ],
    
    async generate(args) {
      const { report_type, time_period = 'weekly' } = args;
      
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Create a comprehensive ${report_type} report for the ${time_period} period.
                     
                     Include:
                     - Key metrics and KPIs
                     - Trend analysis
                     - Comparative data
                     - Visual charts recommendations
                     - Risk assessment
                     - Strategic recommendations
                     
                     Use data from available resources and tools to support your analysis.`
            }
          }
        ]
      };
    }
  },

  'troubleshoot_system': {
    name: 'troubleshoot_system',
    description: 'Provide system troubleshooting guidance based on logs and metrics',
    arguments: [
      {
        name: 'issue_description',
        description: 'Description of the system issue',
        required: true
      },
      {
        name: 'severity',
        description: 'Issue severity (low, medium, high, critical)',
        required: false
      }
    ],
    
    async generate(args) {
      const { issue_description, severity = 'medium' } = args;
      
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `System Issue: ${issue_description}
                     Severity: ${severity}
                     
                     Please provide troubleshooting guidance:
                     
                     1. Immediate Actions
                     2. Diagnostic Steps
                     3. Root Cause Analysis
                     4. Resolution Steps
                     5. Prevention Measures
                     
                     Use system logs and available data to inform your recommendations.
                     Prioritize based on severity level.`
            }
          }
        ]
      };
    }
  }
};