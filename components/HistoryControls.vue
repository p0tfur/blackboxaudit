<template>
  <div class="space-y-4 mb-6">
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="relative flex-1 w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          placeholder="Search by URL..."
          class="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
        />
      </div>

      <div class="flex items-center gap-4 w-full sm:w-auto">
        <select
          v-model="severityFilter"
          class="block w-full sm:w-40 pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          v-model="sortField"
          class="block w-full sm:w-40 pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        >
          <option value="date">Date</option>
          <option value="issues">Issues Count</option>
          <option value="severity">Severity</option>
        </select>

        <button
          @click="toggleSortOrder"
          class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          :title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
        >
          <svg
            v-if="sortOrder === 'asc'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { useHistoryFilters } from "../composables/useHistoryFilters";

export default defineComponent({
  name: "HistoryControls",
  setup() {
    const { sortField, sortOrder, severityFilter, searchQuery } = useHistoryFilters();

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    };

    return {
      sortField,
      sortOrder,
      severityFilter,
      searchQuery,
      toggleSortOrder,
    };
  },
});
</script>
