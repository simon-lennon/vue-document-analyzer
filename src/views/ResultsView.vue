<template>
  <div class="results-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Analysis Results</h1>
      <div>
        <button @click="goBack" class="btn btn-outline-primary me-2">
          <i class="bi bi-arrow-left me-2"></i>
          Back
        </button>
        <button @click="newAnalysis" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          New Analysis
        </button>
      </div>
    </div>
    
    <div v-if="!documentStore.hasAnalysisResult" class="text-center p-5 my-4">
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        No analysis results available. Please upload and analyze a document first.
      </div>
      <router-link to="/analyze" class="btn btn-primary mt-3">
        <i class="bi bi-arrow-right me-2"></i>
        Go to Analysis
      </router-link>
    </div>
    
    <div v-else class="row">
      <!-- Document Information -->
      <div class="col-md-4 mb-4">
        <div class="card shadow h-100">
          <div class="card-header bg-light">
            <h4 class="mb-0">Document Information</h4>
          </div>
          <div class="card-body">
            <div v-if="documentStore.document" class="text-center mb-4">
              <i class="bi bi-file-earmark-text text-primary" style="font-size: 3rem;"></i>
              <h5 class="mt-3">{{ documentStore.document.name }}</h5>
            </div>
            
            <h5>Extracted Key Information</h5>
            <div v-if="documentStore.documentKeyValuePairs.length > 0">
              <table class="table table-sm">
                <tbody>
                  <tr v-for="(pair, index) in documentStore.documentKeyValuePairs" :key="index">
                    <th>{{ pair.key }}</th>
                    <td>{{ pair.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-muted">
              No key-value pairs extracted from this document.
            </div>
            
            <div class="mt-4">
              <h5>Ask Another Question</h5>
              <div class="input-group mb-3">
                <input 
                  type="text" 
                  v-model="newQuestion" 
                  class="form-control" 
                  placeholder="Ask about this document..."
                  :disabled="documentStore.isLoading || !documentStore.isConfigured"
                >
                <button 
                  @click="askNewQuestion" 
                  class="btn btn-primary" 
                  :disabled="documentStore.isLoading || !newQuestion || !documentStore.isConfigured"
                >
                  <span v-if="documentStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-send me-2"></i>
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Analysis Results -->
      <div class="col-md-8 mb-4">
        <div class="card shadow h-100">
          <div class="card-header bg-light">
            <h4 class="mb-0">Claude's Analysis</h4>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5>Results</h5>
              <button @click="copyToClipboard" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-clipboard me-2"></i>
                Copy
              </button>
            </div>
            
            <div class="p-4 border rounded bg-light analysis-content">
              <div v-if="documentStore.isLoading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Analyzing document...</p>
              </div>
              <div v-else class="analysis-text" v-html="formattedAnalysis"></div>
            </div>
            
            <div v-if="documentStore.documentTables.length > 0" class="mt-4">
              <h5>Document Tables</h5>
              <TableDisplay 
                :tables="documentStore.documentTables" 
                :showCopyButton="true"
              />
            </div>
            
            <div v-if="documentStore.error" class="alert alert-danger mt-4">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ documentStore.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDocumentStore } from '../stores/documentStore'
import { useRouter } from 'vue-router'
import TableDisplay from '../components/TableDisplay.vue'

const documentStore = useDocumentStore()
const router = useRouter()
const newQuestion = ref('')

// Format the analysis text with line breaks
const formattedAnalysis = computed(() => {
  if (!documentStore.analysisResult) return ''
  return documentStore.analysisResult
    .split('\n')
    .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
    .join('')
})

// Go back to the analysis page
const goBack = () => {
  router.push('/analyze')
}

// Start a new analysis
const newAnalysis = () => {
  documentStore.clearAll()
  router.push('/analyze')
}

// Ask a new question about the document
const askNewQuestion = async () => {
  await documentStore.analyzeWithClaude(newQuestion.value)
  newQuestion.value = ''
}

// Copy the analysis results to clipboard
const copyToClipboard = () => {
  navigator.clipboard.writeText(documentStore.analysisResult)
    .then(() => {
      alert('Analysis copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy text: ', err)
    })
}
</script>

<style scoped>
.analysis-content {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.analysis-text p {
  margin-bottom: 0.75rem;
}
</style>
