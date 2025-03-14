import axios from 'axios'

// In a real-world application, you would have a proper backend API
// This file simulates API calls for demonstration purposes

// Create base API instance
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 60000 // 60 seconds timeout for document processing
})

export const documentService = {
  /**
   * Process a document with Azure Document Intelligence
   * @param {File} file - The document file to process
   * @param {Object} config - API configuration
   * @returns {Promise} - Promise with document data
   */
  async processDocument(file, config) {
    try {
      // In a real application, this would send the file to your backend
      // For demonstration, let's simulate a successful response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Return simulated result
      return {
        documentText: 'This is the extracted text from the document. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus non eros feugiat tincidunt.',
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
      }
      
      // Implementation with a real backend would look like this:
      /*
      const formData = new FormData()
      formData.append('document', file)
      
      const response = await api.post('/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Azure-Endpoint': config.azureEndpoint,
          'X-Azure-Key': config.azureKey
        }
      })
      
      return response.data
      */
    } catch (error) {
      console.error('Error processing document:', error)
      throw new Error('Failed to process document. Please try again.')
    }
  },
  
  /**
   * Analyze document content with Claude API
   * @param {Object} data - Document data and question
   * @param {String} apiKey - Claude API key
   * @returns {Promise} - Promise with analysis result
   */
  async analyzeWithClaude(data, apiKey) {
    try {
      // In a real application, this would send the data to your backend
      // For demonstration, let's simulate a successful response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Return simulated result
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
        `
      }
      
      // Implementation with a real backend would look like this:
      /*
      const response = await api.post('/analyze-with-claude', data, {
        headers: {
          'X-Claude-Api-Key': apiKey
        }
      })
      
      return response.data
      */
    } catch (error) {
      console.error('Error analyzing with Claude:', error)
      throw new Error('Failed to analyze with Claude. Please try again.')
    }
  }
}

export default {
  documentService
}
