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

    <button
      @click="handleGetBadge"
      :disabled="isCreatingCert"
      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-wait"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      {{ isCreatingCert ? 'Generating...' : 'Get Verified Badge' }}
    </button>
  </div>
</div>

<div class="mt-6" v-if="score >= 80 && !showBadgeModal && !certificateId">
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
             <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <h4 class="font-bold text-slate-900">Excellent Score! Claim your badge.</h4>
                <p class="text-sm text-slate-600">Show visitors your site is secure by embedding a verification badge.</p>
             </div>
        </div>
        <button @click="handleGetBadge" class="whitespace-nowrap px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 font-medium text-sm transition-colors shadow-sm">
           Generate Badge
        </button>
    </div>
</div>
    <!-- Badge Modal -->
    <Teleport to="body">
      <div v-if="showBadgeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" @click.self="showBadgeModal = false">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-slide">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Get Verified Badge
              </h3>
              <p class="text-sm text-slate-500 mt-1">Embed this badge on your site to show off your security score.</p>
            </div>
            <button @click="showBadgeModal = false" class="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-6">
            <Suspense>
              <BadgeGenerator v-if="certificateId" :certificate-id="certificateId" />
              <template #fallback>
                <div class="flex justify-center p-12">
                   <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import { useReportManager } from "../composables/useReportManager";
import { useScanHistory } from "../composables/useScanHistory";
import { useCertificate } from "../composables/useCertificate";

const BadgeGenerator = defineAsyncComponent(() => import("./BadgeGenerator.vue"));

const store = useScanStore();
const { url, results, score, scanDuration } = storeToRefs(store);

const reportManager = useReportManager();
const scanHistory = useScanHistory();
const { createCertificate } = useCertificate();

const showBadgeModal = ref(false);
const certificateId = ref<string | null>(null);
const isCreatingCert = ref(false);

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

const handleGetBadge = async () => {
  if (!url.value) return;
  
  isCreatingCert.value = true;
  try {
    const report = {
      url: url.value,
      date: new Date().toISOString(),
      results: results.value,
      score: score.value,
      scanDuration: scanDuration.value
    };
    
    // Create database record
    const response = await createCertificate(report);
    if (response?.certificateId) {
      certificateId.value = response.certificateId;
      showBadgeModal.value = true;
    }
  } catch (e) {
    console.error("Failed to generate certificate", e);
    alert("Failed to create certificate. Please try again.");
  } finally {
    isCreatingCert.value = false;
  }
};

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
