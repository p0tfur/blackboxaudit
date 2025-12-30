<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex-1">
        <!-- Optional: Add controls or filtering here if needed in future -->
      </div>
      <div class="text-right w-full sm:w-auto">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Weekly Scan Limit</span>
        <div class="flex items-center gap-3">
          <div class="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="remainingScans > 2 ? 'bg-emerald-500' : 'bg-amber-500'"
              :style="{ width: ((maxScans - remainingScans) / maxScans) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-sm font-medium text-slate-700">{{ remainingScans }} left</span>
        </div>
      </div>
    </div>

    <HistoryControls class="mb-6" />

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
      <div
        v-if="filteredAndSortedHistory.length === 0"
        class="h-full flex flex-col items-center justify-center p-8 text-center"
      >
        <div class="bg-slate-50 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900">No History Found</h3>
        <p class="text-slate-500 max-w-sm mt-1">Start a scan to see results here.</p>
      </div>
      <VirtualList v-else :data="filteredAndSortedHistory" :item-height="88" :buffer-size="5" class="h-full">
        <template #default="{ item: scan }">
          <div
            class="group hover:bg-slate-50 cursor-pointer transition-colors p-4 border-b border-slate-100 last:border-b-0"
            @click="selectScan(scan)"
          >
            <div class="flex justify-between items-center">
              <div class="min-w-0 flex-1 pr-4">
                <h3 class="text-base font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                  {{ scan.url }}
                </h3>
                <span class="text-xs font-medium text-slate-500 mt-1 block flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ formatDate(scan.date) }}
                </span>
              </div>
              <div class="flex-shrink-0">
                <span
                  class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border"
                  :class="{
                    'bg-red-50 text-red-700 border-red-100': getSeverityVariant(scan.results) === 'error',
                    'bg-amber-50 text-amber-700 border-amber-100': getSeverityVariant(scan.results) === 'warning',
                    'bg-emerald-50 text-emerald-700 border-emerald-100': getSeverityVariant(scan.results) === 'success',
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
import { computed, defineComponent, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore, type ScanHistoryEntry } from "../stores/scan";
import { useScanLimits } from "../composables/useScanLimits";
import { useHistoryFilters } from "../composables/useHistoryFilters";
import VirtualList from "./VirtualList.vue";
import HistoryControls from "./HistoryControls.vue";

export default defineComponent({
  name: "ScanHistory",
  components: {
    VirtualList,
    HistoryControls,
  },
  setup() {
    const store = useScanStore();
    const { history } = storeToRefs(store);
    const { maxScans, remainingScans } = useScanLimits();

    const { applySorting, applyFilters } = useHistoryFilters();

    const filteredAndSortedHistory = computed(() => {
      return applySorting(applyFilters(history.value));
    });

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getSeverityVariant = (results: ScanHistoryEntry["results"]) => {
      if (results.some((r) => r.severity === "high")) return "error";
      if (results.some((r) => r.severity === "medium")) return "warning";
      return "success";
    };

    const selectScan = (scan: ScanHistoryEntry) => {
      store.loadHistoryEntry(scan);
    };

    onMounted(() => {
      store.loadHistory();
    });

    return {
      maxScans,
      remainingScans,
      filteredAndSortedHistory,
      formatDate,
      getSeverityVariant,
      selectScan,
    };
  },
});
</script>
