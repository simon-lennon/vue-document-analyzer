<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container position-relative">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-file-earmark-text me-2"></i>
          HICX AI Powered Document Analyzer        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/analyze">Analyze</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/results">Results</router-link>
            </li>
          </ul>
 
          <div class="navbar-nav ms-auto">
            <a v-if="documentStore.isConfigured" 
               href="#" 
               class="nav-link" 
               @click.prevent="showSettings">
              <i class="bi bi-gear me-1"></i>
              Settings
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-view />
    </div>

    <footer class="footer mt-5 py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">© 2025 HICX AI Powered Document Analyzer </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDocumentStore } from './stores/documentStore'
import { useRouter } from 'vue-router'

const documentStore = useDocumentStore()
const router = useRouter()

onMounted(() => {
  // Load API configuration from localStorage on app start
  documentStore.loadApiConfig()
})

const showSettings = () => {
  documentStore.toggleConfig()
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

.footer {
  margin-top: auto;
}

.navbar-logo {
  height: 30px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
