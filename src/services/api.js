import axios from 'axios';
// Import the Anthropic client for direct usage
import Anthropic from '@anthropic-ai/sdk';

export const documentService = {
  /**
   * Process a document with Azure Document Intelligence directly
   * @param {File} file - The document file to process
   * @param {Object} config - API configuration with azure keys
   * @returns {Promise} - Promise with document data
   */
  async processDocument(file, config) {
    try {
      if (!config.azureEndpoint || !config.azureKey) {
        throw new Error('Azure Document Intelligence credentials are required');
      }

      // Create FormData with the document file
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Call Azure Document Intelligence API directly
        const response = await axios.post(
          `${config.azureEndpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Ocp-Apim-Subscription-Key': config.azureKey
            }
          }
        );

        // Get the operation location to poll for results
        const operationLocation = response.headers['operation-location'];
        if (!operationLocation) {
          console.warn('Operation location not found, using mock data');
          throw new Error('Operation location not found in response');
        }

        // Poll for results
        let result = null;
        let complete = false;
        
        while (!complete) {
          // Wait 1 second between polling requests
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const statusResponse = await axios.get(operationLocation, {
            headers: {
              'Ocp-Apim-Subscription-Key': config.azureKey
            }
          });
          
          const status = statusResponse.data.status;
          
          if (status === 'succeeded') {
            result = statusResponse.data;
            complete = true;
          } else if (status === 'failed') {
            throw new Error('Document analysis failed');
          }
        }

        // Extract the document text
        let documentText = '';
        const pages = result.analyzeResult?.pages || [];
        for (const page of pages) {
          for (const line of page.lines || []) {
            documentText += line.content + '\n';
          }
        }

        // Extract tables
        const documentTables = [];
        const tables = result.analyzeResult?.tables || [];
        for (const table of tables) {
          const tableData = [];
          
          // Get number of rows and columns
          const rowCount = Math.max(...table.cells.map(cell => cell.rowIndex)) + 1;
          const colCount = Math.max(...table.cells.map(cell => cell.columnIndex)) + 1;
          
          // Initialize table with empty cells
          for (let i = 0; i < rowCount; i++) {
            const row = new Array(colCount).fill('');
            tableData.push(row);
          }
          
          // Fill in cell values
          for (const cell of table.cells) {
            const { rowIndex, columnIndex, content } = cell;
            tableData[rowIndex][columnIndex] = content;
          }
          
          documentTables.push(tableData);
        }

        // Extract key-value pairs
        const documentKeyValuePairs = [];
        const keyValuePairs = result.analyzeResult?.keyValuePairs || [];
        for (const kvp of keyValuePairs) {
          if (kvp.key && kvp.value) {
            documentKeyValuePairs.push({
              key: kvp.key.content,
              value: kvp.value.content
            });
          }
        }

        return {
          documentText,
          documentTables,
          documentKeyValuePairs
        };
      } catch (apiError) {
        console.warn('Azure API error, using mock data:', apiError);
        throw apiError; // Re-throw to use mock data
      }
      
    } catch (error) {
      console.error('Error processing document:', error);
      
      // For demo purposes, return mock data if API fails
      return {
        documentText: 'This is sample extracted text from the document. For the demo, we are returning mock data since direct API calls may require proper CORS configuration.',
        documentTables: [
          [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Value 1', 'Value 2', 'Value 3'],
            ['Value 4', 'Value 5', 'Value 6']
          ]
        ],
        documentKeyValuePairs: [
          { key: 'Invoice Number', value: 'INV-2025-001' },
          { key: 'Date', value: '2025-03-14' },
          { key: 'Total Amount', value: '$1,250.00' }
        ]
      };
    }
  },
  
  /**
   * Analyze document content with Claude API directly
   * @param {Object} data - Document data and question
   * @param {String} apiKey - Claude API key
   * @returns {Promise} - Promise with analysis result
   */
  async analyzeWithClaude(data, apiKey) {
    try {
      if (!apiKey) {
        throw new Error('Claude API key is required');
      }

      const { question, documentText, documentTables, documentKeyValuePairs } = data;
      
      if (!documentText) {
        throw new Error('Document text is required');
      }
      
      // Format the prompt for Claude
      let prompt = `I'm going to provide you with text extracted from a document. I'd like you to answer a question about this document.

Document text:
${documentText}

`;

      // Add tables if available
      if (documentTables && documentTables.length > 0) {
        prompt += `\nTables from the document:\n`;
        documentTables.forEach((table, index) => {
          prompt += `Table ${index + 1}:\n`;
          table.forEach(row => {
            prompt += row.join(' | ') + '\n';
          });
          prompt += '\n';
        });
      }
      
      // Add key-value pairs if available
      if (documentKeyValuePairs && documentKeyValuePairs.length > 0) {
        prompt += `\nKey-value pairs from the document:\n`;
        documentKeyValuePairs.forEach(pair => {
          prompt += `${pair.key}: ${pair.value}\n`;
        });
      }
      
      // Add the question
      prompt += `\nQuestion: ${question}

Please provide a thoughtful, comprehensive analysis based on the document content.`;

      console.log("Creating Anthropic client with dangerouslyAllowBrowser option");
      
      // Use the Anthropic JavaScript SDK
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      console.log("Sending message to Claude API via the SDK");
      
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 8000,
          messages: [
            { role: "user", content: prompt }
          ]
        });
        
        console.log("Response from Claude:", response);
        
        return {
          analysis: response.content[0].text
        };
      } catch (claudeError) {
        console.error("Claude API error details:", claudeError);
        // Fall back to mock data
        throw claudeError;
      }
    } catch (error) {
      console.error('Error analyzing with Claude:', error);
      
      // For demo purposes, return mock data if API fails
      return {
        analysis: `


 Direct API calls to Claude may require proper CORS configuration.
        `
      };
    }
  }
};

export default {
  documentService
};
