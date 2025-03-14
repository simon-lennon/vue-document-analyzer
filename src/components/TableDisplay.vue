<template>
  <div class="table-display">
    <div v-if="!tables || tables.length === 0" class="text-muted">
      No tables found in the document.
    </div>
    
    <div v-else>
      <div v-for="(table, tableIndex) in tables" :key="tableIndex" class="mb-4">
        <div v-if="showTitle" class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Table {{ tableIndex + 1 }}</h6>
          <button 
            v-if="showCopyButton" 
            @click="copyTable(table)" 
            class="btn btn-sm btn-outline-secondary"
          >
            <i class="bi bi-clipboard me-1"></i>
            Copy
          </button>
        </div>
        
        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <tbody>
              <tr v-for="(row, rowIndex) in table" :key="rowIndex">
                <td 
                  v-for="(cell, cellIndex) in row" 
                  :key="cellIndex"
                  :class="{'table-primary': rowIndex === 0 && treatFirstRowAsHeader}"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  tables: {
    type: Array,
    default: () => []
  },
  treatFirstRowAsHeader: {
    type: Boolean,
    default: true
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  showCopyButton: {
    type: Boolean,
    default: false
  }
})

/**
 * Copy table data to clipboard as tab-separated values
 */
const copyTable = (table) => {
  // Convert table to tab-separated text
  const tableText = table.map(row => row.join('\t')).join('\n')
  
  // Copy to clipboard
  navigator.clipboard.writeText(tableText)
    .then(() => {
      alert('Table copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy table: ', err)
    })
}
</script>
