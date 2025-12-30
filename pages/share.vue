<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl">
    <template v-if="report">
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Security Audit Report</h1>
        <p class="text-slate-600">Comprehensive security analysis results for your application.</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 mb-8 border border-slate-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <span class="text-xs uppercase tracking-wider font-semibold text-slate-500">Target URL</span>
            <p class="text-lg font-medium text-slate-900 break-all">{{ report.url }}</p>
          </div>

          <div class="space-y-1">
            <span class="text-xs uppercase tracking-wider font-semibold text-slate-500">Scan Date</span>
            <p class="text-lg font-medium text-slate-900">{{ formatDate(report.date) }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-900">Executive Summary</h2>
          </div>
          <div class="p-6">
            <ScanSummary class="max-w-none" />
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">Actions</h2>
          <ReportActions />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-slate-900 text-2xl font-bold mb-2">Report Not Found</h2>
        <p class="text-slate-500 max-w-md mx-auto">
          The security report you are looking for might have expired or does not exist. Please run a new scan.
        </p>
        <div class="mt-8">
          <NuxtLink
            to="/"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-brand-700 bg-brand-100 hover:bg-brand-200 transition-colors"
          >
            Start New Scan
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useScanStore } from "../stores/scan";

const route = useRoute();
const store = useScanStore();

const report = ref(null);

onMounted(() => {
  const data = route.query.data;
  if (data) {
    try {
      const decodedData = decodeURIComponent(data as string);
      report.value = JSON.parse(decodedData);

      // Update store with report data
      store.setUrl(report.value.url);
      store.results = report.value.results;
    } catch (error) {
      console.error("Failed to parse report data:", error);
    }
  }
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
