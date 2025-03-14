import { defineStore } from 'pinia'
import axios from 'axios'

export const useDocumentStore = defineStore('documentStore', {
  state: () => ({
    isLoading: false,
    document: null,
    documentText: '',
    documentTables: [],
    documentKeyValuePairs: [],
    analysisResult: '',
    error: null,
    azureEndpoint: '',
    azureKey: '',
    claudeApiKey: ''
  }),
  
  getters: {
    hasDocument: (state) => !!state.document,
    hasAnalysisResult: (state) => !!state.analysisResult,
    isConfigured: (state) => !!state.azureEndpoint && !!state.azureKey && !!state.claudeApiKey
  },
  
  actions: {
    setDocument(file) {
      this.document = file
      this.documentText = ''
      this.documentTables = []
      this.documentKeyValuePairs = []
      this.analysisResult = ''
      this.error = null
    },
    
    setApiConfig(config) {
      this.azureEndpoint = config.azureEndpoint
      this.azureKey = config.azureKey
      this.claudeApiKey = config.claudeApiKey
      
      // Save to localStorage for persistence
      localStorage.setItem('azureEndpoint', config.azureEndpoint)
      localStorage.setItem('azureKey', config.azureKey)
      localStorage.setItem('claudeApiKey', config.claudeApiKey)
    },
    
    loadApiConfig() {
      // Load from localStorage if available
      this.azureEndpoint = localStorage.getItem('azureEndpoint') || ''
      this.azureKey = localStorage.getItem('azureKey') || ''
      this.claudeApiKey = localStorage.getItem('claudeApiKey') || ''
    },
    
    async processDocument() {
      if (!this.document) {
        this.error = 'No document has been selected'
        return
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        // In a real app, you would send the document to your backend
        // This is a placeholder for the API call that would process the document
        
        // Create form data
        const formData = new FormData()
        formData.append('document', this.document)
        formData.append('azureEndpoint', this.azureEndpoint)
        formData.append('azureKey', this.azureKey)
        
        // Process with Azure Document Intelligence (via your backend)
        // This would be a real API endpoint in a production app
        // const response = await axios.post('/api/process-document', formData)
        
        // For demonstration, simulate a successful response
        // In a real app, this would come from your backend
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate document text extraction
        this.documentText = 'This is the extracted text from the document...'
        this.documentTables = [
          [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Value 1', 'Value 2', 'Value 3'],
            ['Value 4', 'Value 5', 'Value 6']
          ]
        ]
        this.documentKeyValuePairs = [
          { key: 'Invoice Number', value: 'INV-2025-001' },
          { key: 'Date', value: '2025-03-14' },
          { key: 'Total Amount', value: '$1,250.00' }
        ]
        
        this.isLoading = false
      } catch (error) {
        this.error = error.message || 'Failed to process document'
        this.isLoading = false
      }
    },
    
    async analyzeWithClaude(question) {
      if (!this.documentText) {
        this.error = 'No document text available for analysis'
        return
      }
      
      this.isLoading = true
      this.error = null
      
      try {
        // In a real app, you would send this to your backend
        // This is a placeholder for the API call that would call Claude
        
        // Create request data
        const requestData = {
          question,
          documentText: this.documentText,
          documentTables: this.documentTables,
          documentKeyValuePairs: this.documentKeyValuePairs,
          claudeApiKey: this.claudeApiKey
        }
        
        // Analyze with Claude (via your backend)
        // This would be a real API endpoint in a production app
        // const response = await axios.post('/api/analyze-with-claude', requestData)
        
        // For demonstration, simulate a successful response
        // In a real app, this would come from your backend
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Simulate Claude's analysis
        this.analysisResult = `
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
        
        this.isLoading = false
      } catch (error) {
        this.error = error.message || 'Failed to analyze with Claude'
        this.isLoading = false
      }
    },
    
    clearAll() {
      this.document = null
      this.documentText = ''
      this.documentTables = []
      this.documentKeyValuePairs = []
      this.analysisResult = ''
      this.error = null
    }
  }
})
