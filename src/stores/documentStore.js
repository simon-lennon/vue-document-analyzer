import { defineStore } from 'pinia'
import { documentService } from '../services/api'

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
        // Use the API service to process the document
        const config = {
          azureEndpoint: this.azureEndpoint,
          azureKey: this.azureKey
        }
        
        const result = await documentService.processDocument(this.document, config)
        
        // Update state with processed data
        this.documentText = result.documentText
        this.documentTables = result.documentTables
        this.documentKeyValuePairs = result.documentKeyValuePairs
        
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
        // Create request data
        const requestData = {
          question,
          documentText: this.documentText,
          documentTables: this.documentTables,
          documentKeyValuePairs: this.documentKeyValuePairs
        }
        
        // Use the API service to analyze with Claude
        const result = await documentService.analyzeWithClaude(requestData, this.claudeApiKey)
        
        // Update state with analysis result
        this.analysisResult = result.analysis
        
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
