import axios from 'axios'

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
      // Create form data
      const formData = new FormData()
      formData.append('document', file)
      
      // Process with Azure Document Intelligence
      const response = await api.post('/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Azure-Endpoint': config.azureEndpoint,
          'X-Azure-Key': config.azureKey
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error processing document:', error)
      throw new Error(error.response?.data?.error || 'Failed to process document. Please try again.')
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
      // Analyze with Claude
      const response = await api.post('/analyze-with-claude', data, {
        headers: {
          'X-Claude-Api-Key': apiKey
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error analyzing with Claude:', error)
      throw new Error(error.response?.data?.error || 'Failed to analyze with Claude. Please try again.')
    }
  }
}

export default {
  documentService
}
