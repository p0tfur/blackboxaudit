<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold mb-4">Scan Statistics</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <!-- Total Issues Card -->
      <div class="bg-gray-50 rounded-lg p-4 text-center">
        <span class="text-sm font-medium text-gray-600 block">Total Issues</span>
        <span class="text-2xl font-bold text-gray-800 mt-1 block">{{ totalIssues }}</span>
      </div>

      <!-- Security Score Card -->
      <div class="bg-gray-50 rounded-lg p-4 text-center">
        <span class="text-sm font-medium text-gray-600 block">Security Score</span>
        <span class="text-2xl font-bold mt-1 block" :class="scoreColorClass">{{ score }}/100</span>
      </div>

      <!-- Scan Time Card -->
      <div class="bg-gray-50 rounded-lg p-4 text-center">
        <span class="text-sm font-medium text-gray-600 block">Scan Date</span>
        <span class="text-lg font-medium text-gray-800 mt-1 block">{{ formattedScanDate }}</span>
      </div>

      <!-- URL Card -->
      <div class="bg-gray-50 rounded-lg p-4 text-center overflow-hidden">
        <span class="text-sm font-medium text-gray-600 block">URL</span>
        <span class="text-lg font-medium text-gray-800 mt-1 block truncate" :title="url">{{ url }}</span>
      </div>
    </div>

    <!-- Severity Breakdown -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-3">Severity Breakdown</h3>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-red-50 border border-red-100 rounded-lg p-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-red-800">High</span>
            <span class="text-xl font-bold text-red-600">{{ highSeverityCount }}</span>
          </div>
          <div class="mt-1 h-2 bg-red-200 rounded-full overflow-hidden">
            <div class="h-full bg-red-600 rounded-full" :style="{ width: highSeverityPercentage + '%' }"></div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-yellow-800">Medium</span>
            <span class="text-xl font-bold text-yellow-600">{{ mediumSeverityCount }}</span>
          </div>
          <div class="mt-1 h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div class="h-full bg-yellow-600 rounded-full" :style="{ width: mediumSeverityPercentage + '%' }"></div>
          </div>
        </div>

        <div class="bg-green-50 border border-green-100 rounded-lg p-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-green-800">Low</span>
            <span class="text-xl font-bold text-green-600">{{ lowSeverityCount }}</span>
          </div>
          <div class="mt-1 h-2 bg-green-200 rounded-full overflow-hidden">
            <div class="h-full bg-green-600 rounded-full" :style="{ width: lowSeverityPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div>
      <h3 class="text-lg font-medium mb-3">Performance Metrics</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">Scan Duration</span>
            <span class="font-bold text-gray-800">{{ scanDuration }} sec</span>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">Issues per Category</span>
            <span class="font-bold text-gray-800">{{ issuesPerCategory }}</span>
          </div>
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
