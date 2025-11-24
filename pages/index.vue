<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">Security Audit Tool</h1>

    <!-- URL Input Form -->
    <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-8">
      <form @submit.prevent="startScan" class="space-y-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Website URL</label>
          <input
            v-model="url"
            type="url"
            required
            placeholder="https://example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isScanning"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="isScanning" class="mr-2">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isScanning ? "Scanning..." : "Start Scan" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Progress Bar -->
    <div v-if="isScanning" class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mb-8">
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-600">Scan Progress</span>
          <span class="text-sm font-medium text-gray-600">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full"
            :class="progress > 50 ? 'bg-green-600' : 'bg-blue-600'"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <ScanSummary v-if="results.length > 0" class="max-w-2xl mx-auto" />

    <!-- Statistics and Charts Section -->
    <div v-if="results.length > 0" class="max-w-2xl mx-auto">
      <ScanStatistics />
      <SecurityCharts />
    </div>

    <!-- Scan History Section -->
    <div v-if="results.length > 0" class="mt-8">
      <ScanHistory />
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl mx-auto mt-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="ri-error-warning-line text-red-400 text-xl"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import { scanWebsite } from "../services/securityScanner";
import ScanSummary from "../components/ScanSummary.vue";
import ScanHistory from "../components/ScanHistory.vue";
import SecurityCharts from "../components/SecurityCharts.vue";
import ScanStatistics from "../components/ScanStatistics.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    ScanSummary,
    ScanHistory,
    SecurityCharts,
    ScanStatistics,
  },
  setup() {
    const store = useScanStore();
    const { url, isScanning, progress, results, error } = storeToRefs(store);

    onMounted(() => {
      store.loadHistory();
    });

    const startScan = async () => {
      try {
        if (!url.value) {
          store.setError("Please enter a valid URL");
          return;
        }

        store.startScan();
        store.updateProgress(10);

        // Perform actual security scan
        const scanResult = await scanWebsite(url.value);

        // Update progress during scan
        store.updateProgress(60);

        const normalizedResults: ReturnType<typeof useScanStore>["results"] =
          scanResult.results.length > 0
            ? scanResult.results
            : [
                {
                  name: "No Security Issues Found",
                  severity: "low",
                  recommendation: "Your website appears to be secure. Continue monitoring for new vulnerabilities.",
                  category: "information",
                },
              ];

        store.setResults(normalizedResults);
        store.updateProgress(90);
        store.finishScan({
          scanDuration: scanResult.scanDuration,
          url: scanResult.url,
        });
      } catch (err) {
        store.setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    return {
      url,
      isScanning,
      progress,
      results,
      error,
      startScan,
    };
  },
});
</script>
