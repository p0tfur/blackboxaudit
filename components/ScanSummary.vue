<template>
  <div class="space-y-6">
    <!-- Summary Statistics -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-center">
          <span class="text-sm font-medium text-gray-600 block">High Severity</span>
          <span class="text-2xl font-bold text-red-600 mt-1 block">{{ highSeverityCount }}</span>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-center">
          <span class="text-sm font-medium text-gray-600 block">Medium Severity</span>
          <span class="text-2xl font-bold text-yellow-600 mt-1 block">{{ mediumSeverityCount }}</span>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="text-center">
          <span class="text-sm font-medium text-gray-600 block">Low Severity</span>
          <span class="text-2xl font-bold text-green-600 mt-1 block">{{ lowSeverityCount }}</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex space-x-2">
      <button
        v-for="severity in ['all', 'high', 'medium', 'low']"
        :key="severity"
        @click="activeFilter = severity"
        :class="[
          'px-4 py-2 rounded-md font-medium transition-colors',
          activeFilter === severity
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ severity.charAt(0).toUpperCase() + severity.slice(1) }}
      </button>
    </div>

    <!-- Results List -->
    <div class="space-y-4">
      <div
        v-for="result in filteredResults"
        :key="result.name"
        :class="[
          'p-4 rounded-lg border',
          result.severity === 'high' ? 'bg-red-50 border-red-200' :
          result.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        ]"
      >
        <h3 class="text-lg font-medium">{{ result.name }}</h3>
        <p class="mt-1 text-gray-700">{{ result.recommendation }}</p>
        <span
          :class="[
            'inline-block px-2 py-1 text-sm font-medium rounded-full mt-2',
            result.severity === 'high' ? 'bg-red-100 text-red-800' :
            result.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          ]"
        >
          {{ result.severity }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useScanStore } from '../stores/scan'
import type { ScanResult } from '../stores/scan'

export default defineComponent({
  setup() {

    const store = useScanStore()
    const { results } = storeToRefs(store)

    const activeFilter = ref('all')

    const filteredResults = computed(() => {
      if (activeFilter.value === 'all') return results.value
      return results.value.filter((result: ScanResult) => result.severity === activeFilter.value)
    })

    const highSeverityCount = computed(() => 
      results.value.filter((result: ScanResult) => result.severity === 'high').length
    )

    const mediumSeverityCount = computed(() => 
      results.value.filter((result: ScanResult) => result.severity === 'medium').length
    )

    const lowSeverityCount = computed(() => 
      results.value.filter((result: ScanResult) => result.severity === 'low').length
    )
    
    return {
      activeFilter,
      filteredResults,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount
    }
  }
})
</script>