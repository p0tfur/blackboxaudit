<template>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">Report Actions</h3>

    <div class="flex flex-wrap gap-2">
      <!-- Export Buttons -->
      <button
        @click="handleExport('pdf')"
        class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium border border-slate-200 hover:border-slate-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd"
          />
        </svg>
        Export PDF
      </button>

      <button
        @click="handleExport('csv')"
        class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium border border-slate-200 hover:border-slate-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        Export CSV
      </button>

      <button
        @click="handleExport('json')"
        class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium border border-slate-200 hover:border-slate-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Export JSON
      </button>

      <!-- Share Button (Now links to share page) -->
      <NuxtLink
        v-if="shareLinkData"
        :to="{ path: '/share', query: { data: shareLinkData } }"
        target="_blank"
        class="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
          />
        </svg>
        Share Report
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import { useReportManager } from "../composables/useReportManager";
import { useScanHistory } from "../composables/useScanHistory";

const store = useScanStore();
const { url, results, score } = storeToRefs(store);

const reportManager = useReportManager();
const scanHistory = useScanHistory();

// Compute the share data string for the link
const shareLinkData = computed(() => {
  if (!url.value) return null;

  const report = {
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value,
  };
  return encodeURIComponent(JSON.stringify(report));
});

const handleExport = async (format: "pdf" | "csv" | "json") => {
  const report = {
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value,
  };

  // Add to scan history
  scanHistory.addScan({
    url: url.value,
    date: new Date().toISOString(),
    results: results.value,
    score: score.value,
  });

  switch (format) {
    case "pdf":
      await reportManager.exportToPDF(report);
      break;
    case "csv":
      await reportManager.exportToCSV(report);
      break;
    case "json":
      await reportManager.exportToJSON(report);
      break;
  }
};
</script>
