<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Scan History</h2>
      <div class="text-right">
        <span class="text-sm text-gray-600 block">
          {{ remainingScans }} scans remaining
        </span>
        <div class="w-32 mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full" 
            :class="remainingScans > 2 ? 'bg-green-500' : 'bg-yellow-500'"
            :style="{ width: (maxScans - remainingScans) / maxScans * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <HistoryControls />
    
    <div class="h-[600px]">
      <VirtualList
        :data="filteredAndSortedHistory"
        :item-height="100"
        :buffer-size="3"
      >
        <template #default="{ item: scan }">
          <div
            class="hover:bg-gray-50 cursor-pointer transition-colors mb-2 p-4 border border-gray-200 rounded-lg shadow-sm"
            @click="selectScan(scan)"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="text-sm text-gray-600 block">{{ formatDate(scan.date) }}</span>
                <h3 class="mt-1 text-xl font-semibold">{{ scan.url }}</h3>
              </div>
              <div class="text-right">
                <span 
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full" 
                  :class="{
                    'bg-red-100 text-red-800': getSeverityVariant(scan.results) === 'error',
                    'bg-yellow-100 text-yellow-800': getSeverityVariant(scan.results) === 'warning',
                    'bg-green-100 text-green-800': getSeverityVariant(scan.results) === 'success'
                  }"
                >
                  {{ scan.results.length }} Issues
                </span>
              </div>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { useScanStore } from '../stores/scan'
import { useScanLimits } from '../composables/useScanLimits'
import { useHistoryFilters } from '../composables/useHistoryFilters'
import VirtualList from './VirtualList.vue'
import HistoryControls from './HistoryControls.vue'

interface ScanHistoryItem {
  id: string
  url: string
  date: string
  results: Array<{
    name: string
    severity: 'high' | 'medium' | 'low'
    recommendation: string
  }>
}

export default defineComponent({
  name: 'ScanHistory',
  components: {
    VirtualList,
    HistoryControls
  },
  setup() {
    const store = useScanStore()
    const { maxScans, remainingScans } = useScanLimits()

    // In a real app, this would be persisted to localStorage or a backend
    const scanHistory = ref<ScanHistoryItem[]>([])

    const { applySorting, applyFilters } = useHistoryFilters()

    const filteredAndSortedHistory = computed(() => {
      return applySorting(applyFilters(scanHistory.value))
    })

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getSeverityVariant = (results: ScanHistoryItem['results']) => {
      if (results.some(r => r.severity === 'high')) return 'error'
      if (results.some(r => r.severity === 'medium')) return 'warning'
      return 'success'
    }

    const selectScan = (scan: ScanHistoryItem) => {
      store.setUrl(scan.url)
      store.results = scan.results
    }
    
    return {
      maxScans,
      remainingScans,
      filteredAndSortedHistory,
      formatDate,
      getSeverityVariant,
      selectScan
    }
  }
})
</script>