<template>
  <div class="analysis-view">
    <h1 class="mb-4">Document Analysis</h1>
    
    <div v-if="!documentStore.isConfigured" class="alert alert-warning" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>API Configuration Required!</strong> 
      Please configure your Azure Document Intelligence and Claude API keys in the 
      <router-link to="/" class="alert-link">Home page</router-link>.
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow h-100">
          <div class="card-header">
            <h4 class="mb-0">Upload Document</h4>
          </div>
          <div class="card-body d-flex flex-column">
            <div v-if="!documentStore.document" class="upload-area my-4 flex-grow-1 d-flex flex-column align-items-center justify-content-center">
              <input 
                type="file" 
                id="document-upload" 
                ref="fileInput" 
                @change="handleFileUpload" 
                class="d-none" 
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.docx,.doc"
              >
              <div class="text-center p-5 border border-2 border-dashed rounded w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                <i class="bi bi-cloud-arrow-up text-primary" style="font-size: 4rem;"></i>
                <h5 class="mt-3">Drag &amp; Drop your document here</h5>
                <p class="text-muted">or</p>
                <button @click="triggerFileInput" class="btn btn-primary">
                  <i class="bi bi-file-earmark me-2"></i>
                  Browse Files
                </button>
                <p class="text-muted mt-3">
                  <small>Supported formats: PDF, PNG, JPG, TIFF, DOC, DOCX</small>
                </p>
              </div>
            </div>
            
            <div v-else class="selected-file my-4 flex-grow-1">
              <div class="text-center p-4 border rounded bg-light mb-4">
                <i class="bi bi-file-earmark-text text-success" style="font-size: 3rem;"></i>
                <h5 class="mt-3">{{ documentStore.document.name }}</h5>
                <p class="text-muted">
                  {{ formatFileSize(documentStore.document.size) }}
                </p>
              </div>
              
              <div class="d-flex justify-content-between">
                <button @click="removeFile" class="btn btn-outline-danger">
                  <i class="bi bi-trash me-2"></i>
                  Remove
                </button>
                
                <button @click="processDocument" class="btn btn-success" :disabled="documentStore.isLoading || !documentStore.isConfigured">
                  <span v-if="documentStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-gear me-2"></i>
                  Process Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card shadow h-100">
          <div class="card-header">
            <h4 class="mb-0">Document Analysis</h4>
          </div>
          <div class="card-body">
            <div v-if="!documentStore.documentText" class="text-center p-5 my-4">
              <i class="bi bi-file-earmark-text text-muted" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">
                Upload and process a document to see extracted text and analysis options
              </p>
            </div>
            
            <div v-else>
              <h5>Extracted Text</h5>
              <div class="border rounded p-3 mb-4 bg-light" style="max-height: 200px; overflow-y: auto;">
                <p>{{ documentStore.documentText }}</p>
              </div>
              
              <div v-if="documentStore.documentTables.length > 0" class="mb-4">
                <h5>Extracted Tables</h5>
                <TableDisplay :tables="documentStore.documentTables" />
              </div>
              
              <div v-if="documentStore.documentKeyValuePairs.length > 0" class="mb-4">
                <h5>Key Information</h5>
                <table class="table table-sm">
                  <tbody>
                    <tr v-for="(pair, index) in documentStore.documentKeyValuePairs" :key="index">
                      <th>{{ pair.key }}</th>
                      <td>{{ pair.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="mt-4">
                <h5>Ask Claude about this document</h5>
                <div class="input-group mb-3">
                  <input 
                    type="text" 
                    v-model="question" 
                    class="form-control" 
                    placeholder="Ask a question about this document..."
                    :disabled="documentStore.isLoading || !documentStore.isConfigured"
                  >
                  <button 
                    @click="analyzeWithClaude" 
                    class="btn btn-primary" 
                    :disabled="documentStore.isLoading || !question || !documentStore.isConfigured"
                  >
                    <span v-if="documentStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-send me-2"></i>
                    Analyze
                  </button>
                </div>
                
                <div v-if="documentStore.error" class="alert alert-danger mt-3">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ documentStore.error }}
                </div>
                
                <div v-if="documentStore.hasAnalysisResult" class="mt-3">
                  <router-link to="/results" class="btn btn-info w-100">
                    <i class="bi bi-eye me-2"></i>
                    View Analysis Results
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '../stores/documentStore'
import { useRouter } from 'vue-router'
import TableDisplay from '../components/TableDisplay.vue'

const documentStore = useDocumentStore()
const router = useRouter()
const fileInput = ref(null)
const question = ref('')

// Trigger the file input when the browse button is clicked
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle the file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    documentStore.setDocument(file)
  }
}

// Remove the selected file
const removeFile = () => {
  documentStore.clearAll()
  fileInput.value.value = null
}

// Process the document
const processDocument = async () => {
  await documentStore.processDocument()
}

// Analyze with Claude
const analyzeWithClaude = async () => {
  await documentStore.analyzeWithClaude(question.value)
  if (documentStore.hasAnalysisResult) {
    router.push('/results')
  }
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.upload-area {
  min-height: 300px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>
