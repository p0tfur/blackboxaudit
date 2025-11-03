<template>
  <div class="container mx-auto px-4 py-8">
    <template v-if="report">
      <h1 class="mb-8 text-3xl font-bold">Security Audit Report</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-gray-600 block">URL</span>
            <p class="text-base">{{ report.url }}</p>
          </div>
          
          <div>
            <span class="text-sm font-medium text-gray-600 block">Scan Date</span>
            <p class="text-base">{{ formatDate(report.date) }}</p>
          </div>
        </div>
      </div>
      
      <ScanSummary />
      <ReportActions class="mt-8" />
    </template>
    
    <template v-else>
      <div class="text-center py-12">
        <h2 class="text-gray-600 text-2xl font-bold">Report Not Found</h2>
        <p class="mt-4 text-gray-500">The report you're looking for might have been removed or is no longer available.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useScanStore } from '../stores/scan'

const route = useRoute()
const store = useScanStore()

const report = ref(null)

onMounted(() => {
  const data = route.query.data
  if (data) {
    try {
      const decodedData = decodeURIComponent(data as string)
      report.value = JSON.parse(decodedData)
      
      // Update store with report data
      store.setUrl(report.value.url)
      store.results = report.value.results
    } catch (error) {
      console.error('Failed to parse report data:', error)
    }
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>