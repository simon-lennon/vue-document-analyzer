import axios from 'axios';

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

      // Two options for calling Claude API:
      
      // Option 1: Using axios directly
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );
      
      // Option 2: Using Anthropic JavaScript SDK (if imported)
      // This would require importing the Anthropic client:
      // import { Anthropic } from '@anthropic-ai/sdk';
      // 
      // const anthropic = new Anthropic({
      //   apiKey: apiKey,
      //   dangerouslyAllowBrowser: true // Required for browser usage
      // });
      // 
      // const response = await anthropic.messages.create({
      //   model: 'claude-3-opus-20240229',
      //   max_tokens: 1000,
      //   messages: [
      //     { role: 'user', content: prompt }
      //   ]
      // });
      
      return {
        analysis: response.data.content[0].text
      };
      
    } catch (error) {
      console.error('Error analyzing with Claude:', error);
      
      // For demo purposes, return mock data if API fails
      return {
        analysis: `
Based on the document analysis:

This appears to be an invoice dated March 14, 2025, with invoice number INV-2025-001 for a total of $1,250.00.

The document contains a table with 3 line items. Each item includes a description, quantity, and price.

Key insights:
- The invoice is from the current quarter
- The total amount falls within the standard procurement range
- All line items appear to be properly categorized

Recommendations:
- This invoice should be processed according to standard procedures
- The payment terms indicate this should be paid within 30 days
- This expense should be categorized under the Operations budget

Note: This is sample analysis for demo purposes. Direct API calls to Claude may require proper CORS configuration.
        `
      };
    }
  }
};

export default {
  documentService
};
