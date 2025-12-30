<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Issues Card -->
      <div
        class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 flex flex-col justify-center min-h-[120px]"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Total Issues</span>
        <span class="text-3xl font-display font-bold text-slate-800">{{ totalIssues }}</span>
      </div>

      <!-- Security Score Card -->
      <div
        class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 flex flex-col justify-center min-h-[120px]"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Security Score</span>
        <span class="text-3xl font-display font-bold flex justify-center items-baseline" :class="scoreColorClass">
          {{ score }}<span class="text-lg text-slate-400 font-normal ml-0.5">/100</span>
        </span>
      </div>

      <!-- Scan Time Card -->
      <div
        class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 flex flex-col justify-center min-h-[120px]"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Scan Date</span>
        <span class="text-sm font-medium text-slate-700 leading-tight">{{ formattedScanDate }}</span>
      </div>

      <!-- URL Card -->
      <div
        class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100 flex flex-col justify-center min-h-[120px] relative group px-2"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Target URL</span>
        <a
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline block break-all leading-tight"
          :title="url"
        >
          {{ url }}
        </a>
      </div>
    </div>

    <!-- Severity Breakdown -->
    <div class="pt-2">
      <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Severity Breakdown</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div class="flex justify-between items-end mb-2">
            <span class="font-medium text-red-700 text-sm">High</span>
            <span class="text-2xl font-bold text-red-600 leading-none">{{ highSeverityCount }}</span>
          </div>
          <div class="h-1.5 bg-red-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-red-500 rounded-full transition-all duration-500"
              :style="{ width: highSeverityPercentage + '%' }"
            ></div>
          </div>
        </div>

        <div class="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
          <div class="flex justify-between items-end mb-2">
            <span class="font-medium text-amber-700 text-sm">Medium</span>
            <span class="text-2xl font-bold text-amber-600 leading-none">{{ mediumSeverityCount }}</span>
          </div>
          <div class="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-500 rounded-full transition-all duration-500"
              :style="{ width: mediumSeverityPercentage + '%' }"
            ></div>
          </div>
        </div>

        <div class="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
          <div class="flex justify-between items-end mb-2">
            <span class="font-medium text-emerald-700 text-sm">Low</span>
            <span class="text-2xl font-bold text-emerald-600 leading-none">{{ lowSeverityCount }}</span>
          </div>
          <div class="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500"
              :style="{ width: lowSeverityPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="pt-2">
      <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Performance Metrics</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
          <span class="text-sm font-medium text-slate-600">Scan Duration</span>
          <span class="font-bold text-slate-900 font-mono bg-white px-2 py-1 rounded border border-slate-200 text-xs">{{
            scanDuration
          }}</span>
        </div>
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <span class="text-xs font-semibold text-slate-500 uppercase block mb-2">Issues per Category</span>
          <p class="text-xs text-slate-700 font-mono leading-relaxed">{{ issuesPerCategory }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";

export default defineComponent({
  name: "ScanStatistics",
  setup() {
    const store = useScanStore();
    const { url, results, score, scanDate, scanDuration } = storeToRefs(store);

    // Total issues count
    const totalIssues = computed(() => results.value.length);

    // Severity counts
    const highSeverityCount = computed(() => results.value.filter((result) => result.severity === "high").length);

    const mediumSeverityCount = computed(() => results.value.filter((result) => result.severity === "medium").length);

    const lowSeverityCount = computed(() => results.value.filter((result) => result.severity === "low").length);

    // Severity percentages
    const highSeverityPercentage = computed(() =>
      totalIssues.value > 0 ? (highSeverityCount.value / totalIssues.value) * 100 : 0
    );

    const mediumSeverityPercentage = computed(() =>
      totalIssues.value > 0 ? (mediumSeverityCount.value / totalIssues.value) * 100 : 0
    );

    const lowSeverityPercentage = computed(() =>
      totalIssues.value > 0 ? (lowSeverityCount.value / totalIssues.value) * 100 : 0
    );

    // Score color class
    const scoreColorClass = computed(() => {
      if (score.value >= 80) return "text-green-600";
      if (score.value >= 60) return "text-yellow-600";
      return "text-red-600";
    });

    // Formatted scan date
    const formattedScanDate = computed(() => {
      if (!scanDate.value) return "N/A";
      return new Date(scanDate.value).toLocaleString();
    });

    const scanDurationDisplay = computed(() => {
      if (scanDuration.value == null) {
        return "N/A";
      }
      return `${scanDuration.value.toFixed(2)}s`;
    });

    const issuesPerCategory = computed(() => {
      if (results.value.length === 0) {
        return "No data";
      }

      const counts: Record<string, number> = {};
      results.value.forEach((result) => {
        const category = result.category ?? "other";
        counts[category] = (counts[category] ?? 0) + 1;
      });

      return Object.entries(counts)
        .map(([category, count]) => `${category}: ${count}`)
        .join(" • ");
    });

    return {
      url,
      score,
      totalIssues,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
      highSeverityPercentage,
      mediumSeverityPercentage,
      lowSeverityPercentage,
      scoreColorClass,
      formattedScanDate,
      scanDuration: scanDurationDisplay,
      issuesPerCategory,
    };
  },
});
</script>
