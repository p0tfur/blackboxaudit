<template>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">Report Actions</h3>
    
    <div class="flex flex-wrap gap-2">
      <!-- Export Buttons -->
      <button
        @click="handleExport('pdf')"
        class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        <i-mdi-file-pdf-box class="w-5 h-5" />
        Export PDF
      </button>
      
      <button
        @click="handleExport('csv')"
        class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        <i-mdi-file-delimited class="w-5 h-5" />
        Export CSV
      </button>
      
      <button
        @click="handleExport('json')"
        class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        <i-mdi-code-json class="w-5 h-5" />
        Export JSON
      </button>
      
      <!-- Share Button -->
      <button
        @click="handleShare"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <i-mdi-share-variant class="w-5 h-5" />
        Share Report
      </button>
    </div>
    
    <!-- Share Dialog -->
    <div v-if="showShareDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Share Report</h3>
          <button @click="showShareDialog = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <p class="text-gray-600">Share this link to allow others to view the report:</p>
          
          <div class="flex gap-2">
            <input
              v-model="shareableLink"
              readonly
              class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="copyLink"
              class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <i-mdi-content-copy class="w-5 h-5" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useScanStore } from '../stores/scan'
import { useReportManager } from '../composables/useReportManager'
import { useScanHistory } from '../composables/useScanHistory'

const store = useScanStore()
const { url, results, score } = storeToRefs(store)

const reportManager = useReportManager()
const scanHistory = useScanHistory()
const showShareDialog = ref(false)
const shareableLink = ref('')

const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
  const report = {
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value
  }
  
  // Add to scan history
  scanHistory.addScan({
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value
  })
  
  switch (format) {
    case 'pdf':
      await reportManager.exportToPDF(report)
      break
    case 'csv':
      await reportManager.exportToCSV(report)
      break
    case 'json':
      await reportManager.exportToJSON(report)
      break
  }
}

const handleShare = () => {
  const report = {
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value
  }
  
  shareableLink.value = reportManager.generateShareableLink(report)
  showShareDialog.value = true
}

const copyLink = async () => {
  await navigator.clipboard.writeText(shareableLink.value)
}
</script>