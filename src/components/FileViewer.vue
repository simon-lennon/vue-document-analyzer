<template>
  <div class="file-viewer">
    <div v-if="fileType === 'pdf'" class="pdf-viewer">
      <embed 
        :src="fileUrl" 
        type="application/pdf" 
        width="100%" 
        height="100%"
      />
    </div>
    <div v-else-if="fileType === 'image'" class="image-viewer">
      <img :src="fileUrl" class="img-fluid" :alt="fileName" />
    </div>
    <div v-else class="text-viewer">
      <pre>{{ documentStore.documentText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDocumentStore } from '../stores/documentStore'

const documentStore = useDocumentStore()

const fileUrl = computed(() => {
  if (documentStore.document) {
    return URL.createObjectURL(documentStore.document)
  }
  return null
})

const fileName = computed(() => documentStore.document?.name || '')

const fileType = computed(() => {
  if (!documentStore.document) return null
  const type = documentStore.document.type
  if (type.includes('pdf')) return 'pdf'
  if (type.includes('image')) return 'image'
  return 'text'
})
</script>

<style scoped>
.file-viewer {
  background: #f8f9fa;
  width: 100%;
  height: calc(100vh - 120px); 
  /* height: 100%; */
}

.pdf-viewer {
  height: 100%;
}

.pdf-viewer embed {
  width: 100%;
  height: 100%;
  border: none;
}

.image-viewer img {
  max-width: 100%;
  height: auto;
}

.text-viewer pre {
  margin: 0;
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 