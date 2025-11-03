<template>
  <div class="space-y-4 mb-4">
    <div class="flex items-center space-x-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="ri-search-line text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          placeholder="Search by URL..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <select
        v-model="severityFilter"
        class="w-40 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="all">All Severities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <div class="flex items-center space-x-4">
      <select
        v-model="sortField"
        class="w-40 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="date">Date</option>
        <option value="issues">Issues Count</option>
        <option value="severity">Severity</option>
      </select>

      <button
        @click="toggleSortOrder"
        class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <i
          :class="[
            'text-xl',
            sortOrder === 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'
          ]"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useHistoryFilters } from '../composables/useHistoryFilters'

export default defineComponent({
  name: 'HistoryControls',
  setup() {
    const {
      sortField,
      sortOrder,
      severityFilter,
      searchQuery
    } = useHistoryFilters()

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }

    return {
      sortField,
      sortOrder,
      severityFilter,
      searchQuery,
      toggleSortOrder
    }
  }
})
</script>