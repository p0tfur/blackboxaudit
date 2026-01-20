<template>
  <div class="space-y-8">
    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <!-- Pass (Positive Confirmations) -->
      <div
        class="bg-green-50 rounded-xl border border-green-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
      >
        <span class="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Passed</span>
        <span class="text-4xl font-display font-bold text-green-600">{{ passCount }}</span>
        <span class="text-xs text-green-500 mt-2 font-medium">Verified OK</span>
      </div>
      <!-- Info (Informational) -->
      <div
        class="bg-blue-50 rounded-xl border border-blue-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
      >
        <span class="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Info</span>
        <span class="text-4xl font-display font-bold text-blue-600">{{ infoCount }}</span>
        <span class="text-xs text-blue-500 mt-2 font-medium">Notices</span>
      </div>
      <!-- Low -->
      <div
        class="bg-emerald-50 rounded-xl border border-emerald-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
      >
        <span class="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">Low</span>
        <span class="text-4xl font-display font-bold text-emerald-600">{{ lowSeverityCount }}</span>
        <span class="text-xs text-emerald-500 mt-2 font-medium">Suggestions</span>
      </div>
      <!-- Medium -->
      <div
        class="bg-amber-50 rounded-xl border border-amber-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
      >
        <span class="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">Medium</span>
        <span class="text-4xl font-display font-bold text-amber-600">{{ mediumSeverityCount }}</span>
        <span class="text-xs text-amber-500 mt-2 font-medium">Warnings</span>
      </div>
      <!-- High -->
      <div
        class="bg-red-50 rounded-xl border border-red-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
      >
        <span class="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">High</span>
        <span class="text-4xl font-display font-bold text-red-600">{{ highSeverityCount }}</span>
        <span class="text-xs text-red-500 mt-2 font-medium">Critical</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 pb-2">
      <button
        v-for="severity in ['all', 'pass', 'info', 'low', 'medium', 'high']"
        :key="severity"
        @click="activeFilter = severity"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all text-sm border',
          activeFilter === severity
            ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
            : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50',
        ]"
      >
        {{ severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1) }}
      </button>
    </div>

    <!-- Results List -->
    <div class="space-y-4">
      <div
        v-for="result in filteredResults"
        :key="result.name"
        :class="[
          'p-5 rounded-xl border transition-all hover:shadow-md',
          result.severity === 'high'
            ? 'bg-white border-red-100 shadow-sm'
            : result.severity === 'medium'
            ? 'bg-white border-amber-100 shadow-sm'
            : result.severity === 'low'
            ? 'bg-white border-emerald-100 shadow-sm'
            : result.severity === 'info'
            ? 'bg-white border-blue-100 shadow-sm'
            : 'bg-white border-green-100 shadow-sm',
        ]"
      >
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-slate-900">{{ result.name }}</h3>
            <p class="text-slate-600 leading-relaxed">{{ result.recommendation }}</p>
          </div>
          <span
            class="self-start inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap"
            :class="[
              result.severity === 'high'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : result.severity === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                : result.severity === 'low'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : result.severity === 'info'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-green-50 text-green-700 border border-green-100',
            ]"
          >
            {{ result.severity === 'pass' ? '✓ pass' : result.severity }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import type { ScanResult } from "../stores/scan";

export default defineComponent({
  setup() {
    const store = useScanStore();
    const { results } = storeToRefs(store);

    const activeFilter = ref("all");

    const filteredResults = computed(() => {
      if (activeFilter.value === "all") return results.value;
      return results.value.filter((result: ScanResult) => result.severity === activeFilter.value);
    });

    // Count by severity
    const passCount = computed(
      () => results.value.filter((result: ScanResult) => result.severity === "pass").length
    );

    const infoCount = computed(
      () => results.value.filter((result: ScanResult) => result.severity === "info").length
    );

    const highSeverityCount = computed(
      () => results.value.filter((result: ScanResult) => result.severity === "high").length
    );

    const mediumSeverityCount = computed(
      () => results.value.filter((result: ScanResult) => result.severity === "medium").length
    );

    const lowSeverityCount = computed(
      () => results.value.filter((result: ScanResult) => result.severity === "low").length
    );

    return {
      activeFilter,
      filteredResults,
      passCount,
      infoCount,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
    };
  },
});
</script>
