<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl space-y-12">
    <!-- Hero Section -->
    <div class="text-center space-y-4 max-w-2xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
        Analyze your website's <span class="text-brand-600">security posture</span>
      </h1>
      <p class="text-lg text-slate-600 leading-relaxed">
        Get an instant, comprehensive security audit of your web application. We check for common vulnerabilities,
        misconfigurations, and best practices.
      </p>
    </div>

    <!-- URL Input Form -->
    <div
      class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 max-w-3xl mx-auto border border-slate-100 animate-fade-slide"
    >
      <form @submit.prevent="handleStartScan" class="space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-slate-700">Target URL</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              v-model="url"
              type="url"
              required
              placeholder="https://example.com"
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isScanning || !canStartScan"
            class="px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40"
          >
            <svg
              v-if="isScanning"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span v-else class="flex items-center gap-2">
              Start Security Scan
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="isScanning">Analyzing Target...</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Progress Bar -->
    <Transition name="fade">
      <div
        v-if="isScanning"
        class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 max-w-3xl mx-auto border border-slate-100"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              <span class="text-sm font-medium text-slate-700">Scanning in progress...</span>
            </div>
            <span class="text-sm font-bold text-brand-600 font-mono">{{ progress }}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-brand-500 to-brand-400"
              :class="{ 'from-success to-emerald-400': progress > 90 }"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Results Section -->
    <Transition name="fade">
      <Suspense v-if="results.length > 0">
        <template #default>
          <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-4">
              <h2 class="text-xl font-bold text-slate-900">Scan Results</h2>
              <ReportActions />
            </div>
            <div class="p-6">
              <ScanSummary class="max-w-none" />
            </div>
          </div>
        </template>
        <template #fallback>
          <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 animate-pulse h-48"></div>
        </template>
      </Suspense>
    </Transition>

    <!-- Statistics and Charts Section -->
    <Transition name="fade">
      <div v-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense>
          <template #default>
            <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Detailed Statistics</h3>
              <ScanStatistics />
            </div>
          </template>
          <template #fallback>
            <div class="bg-white rounded-2xl shadow-md p-6 h-56 animate-pulse"></div>
          </template>
        </Suspense>

        <Suspense>
          <template #default>
            <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Security Overview</h3>
              <SecurityCharts />
            </div>
          </template>
          <template #fallback>
            <div class="bg-white rounded-2xl shadow-md p-6 h-56 animate-pulse"></div>
          </template>
        </Suspense>
      </div>
    </Transition>

    <!-- Scan History Section -->
    <Transition name="fade">
      <div v-if="results.length > 0" class="pt-8 border-t border-slate-200">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">Recent Scans</h3>
        <Suspense>
          <template #default>
            <ScanHistory />
          </template>
          <template #fallback>
            <div class="bg-white rounded-2xl shadow-md p-6 h-64 animate-pulse"></div>
          </template>
        </Suspense>
      </div>
    </Transition>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 max-w-3xl mx-auto mt-4 animate-fade-slide">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Scan Failed</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import { useSecurityScanner } from "~/composables/useSecurityScanner";

const ScanSummary = defineAsyncComponent(() => import("../components/ScanSummary.vue"));
const ReportActions = defineAsyncComponent(() => import("../components/ReportActions.vue"));
const ScanHistory = defineAsyncComponent(() => import("../components/ScanHistory.vue"));
const SecurityCharts = defineAsyncComponent(() => import("../components/SecurityCharts.vue"));
const ScanStatistics = defineAsyncComponent(() => import("../components/ScanStatistics.vue"));

export default defineComponent({
  name: "IndexPage",
  components: {
    ScanSummary,
    ReportActions,
    ScanHistory,
    SecurityCharts,
    ScanStatistics,
  },
  setup() {
    const store = useScanStore();
    const { url, isScanning, progress, results, error } = storeToRefs(store);
    const { startScan, canStartScan } = useSecurityScanner();

    onMounted(() => {
      store.loadHistory();
    });

    const handleStartScan = () => startScan(url.value);

    return {
      url,
      isScanning,
      progress,
      results,
      error,
      handleStartScan,
      canStartScan,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
