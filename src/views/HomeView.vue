<template>
  <div class="home">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow mb-4">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <i class="bi bi-file-earmark-text text-primary" style="font-size: 3rem;"></i>
              <h1 class="mt-3">Document Analyzer</h1>
              <p class="lead">Upload, extract, and analyze documents using AI</p>
            </div>
            
            <hr class="my-4">
            
            <div class="row">
              <div class="col-md-4 mb-4">
                <div class="text-center">
                  <i class="bi bi-cloud-upload text-success" style="font-size: 2rem;"></i>
                  <h4 class="mt-3">1. Upload</h4>
                  <p>Upload any PDF, image, or Word document for processing</p>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="text-center">
                  <i class="bi bi-file-text text-primary" style="font-size: 2rem;"></i>
                  <h4 class="mt-3">2. Extract</h4>
                  <p>Extract text, tables, and key information using AI document reader</p>
                </div>
              </div>
              <div class="col-md-4 mb-4">
                <div class="text-center">
                  <i class="bi bi-graph-up text-info" style="font-size: 2rem;"></i>
                  <h4 class="mt-3">3. Analyze</h4>
                  <p>Get AI-powered insights and analysis using AI document analyser</p>
                </div>
              </div>
            </div>
            
            <div class="text-center mt-3">
              <router-link to="/analyze" class="btn btn-primary btn-lg px-5">
                <i class="bi bi-arrow-right-circle me-2"></i>
                Get Started
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Only show API config when settings are missing from storage -->
        <div class="card shadow mb-4" v-if="!storedConfigComplete">
          <div class="card-header">
            <h4 class="mb-0">API Configuration</h4>
          </div>
          <div class="card-body">
            <!-- <div class="alert alert-info mb-4">
              <strong>Demo Application Note:</strong> This is a client-only demo application where API keys are stored only in your browser's localStorage and used for direct API calls. For a production application, a server-side approach would be more secure.
              
              <hr>
              
              <strong>CORS Notice:</strong> Direct API calls may encounter CORS restrictions. If API calls fail, the application will display sample mock data for demonstration purposes.
            </div> -->
            
            <form @submit.prevent="saveConfig">
              <div class="mb-3">
                <label for="azureEndpoint" class="form-label">Azure Document Intelligence Endpoint</label>
                <input 
                  type="text" 
                  id="azureEndpoint" 
                  v-model="config.azureEndpoint" 
                  class="form-control" 
                  placeholder="https://your-resource.cognitiveservices.azure.com/"
                >
              </div>
              
              <div class="mb-3">
                <label for="azureKey" class="form-label">Azure Document Intelligence Key</label>
                <input 
                  type="password" 
                  id="azureKey" 
                  v-model="config.azureKey" 
                  class="form-control" 
                  placeholder="Enter your Azure key"
                >
              </div>
              
              <div class="mb-3">
                <label for="claudeApiKey" class="form-label">Claude API Key</label>
                <input 
                  type="password" 
                  id="claudeApiKey" 
                  v-model="config.claudeApiKey" 
                  class="form-control" 
                  placeholder="Enter your Claude API key"
                >
              </div>
              
              <div class="text-end">
                <button type="submit" class="btn btn-success">
                  <i class="bi bi-save me-2"></i>
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDocumentStore } from '../stores/documentStore'

const documentStore = useDocumentStore()

// Create a ref for the config form
const config = ref({
  azureEndpoint: documentStore.azureEndpoint,
  azureKey: documentStore.azureKey,
  claudeApiKey: documentStore.claudeApiKey
})

// Save configuration to the store
const saveConfig = () => {
  documentStore.setApiConfig({
    azureEndpoint: config.value.azureEndpoint,
    azureKey: config.value.azureKey,
    claudeApiKey: config.value.claudeApiKey
  })
  
  alert('Configuration saved successfully!')
}

// Computed property to check if all config fields are set in the store
const storedConfigComplete = computed(() => {
  return documentStore.azureEndpoint && 
         documentStore.azureKey && 
         documentStore.claudeApiKey
})
</script>
