<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide text-center">Issues by Category</h4>
        <div class="h-64 relative">
          <PieChart :data="categoryChartData" :options="chartOptions" />
        </div>
      </div>
      <div>
        <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide text-center">Severity Distribution</h4>
        <div class="h-64 relative">
          <DoughnutChart :data="severityChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from "pinia";
import { useScanStore } from "../stores/scan";
import { Pie as PieChart, Doughnut as DoughnutChart } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
  name: "SecurityCharts",
  components: {
    PieChart,
    DoughnutChart,
  },
  setup() {
    const store = useScanStore();
    const { results } = storeToRefs(store);

    // Chart options
    const chartOptions = computed<ChartOptions<"pie" | "doughnut">>(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    }));

    // Categories chart data
    const categoryChartData = computed(() => {
      const defaultCategories = [
        "transport",
        "headers",
        "content",
        "forms",
        "cookies",
        "information",
        "third-party",
        "other",
      ];
      const counts: Record<string, number> = {};

      defaultCategories.forEach((category) => {
        counts[category] = 0;
      });

      results.value.forEach((issue) => {
        const category = issue.category ?? "other";
        counts[category] = (counts[category] ?? 0) + 1;
      });

      const labels = Object.keys(counts);
      const data = labels.map((label) => counts[label]);

      return {
        labels,
        datasets: [
          {
            backgroundColor: ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#475569"],
            data,
            borderWidth: 0,
          },
        ],
      };
    });

    // Severity chart data
    const severityChartData = computed(() => {
      const severityCounts = {
        High: results.value.filter((i) => i.severity === "high").length,
        Medium: results.value.filter((i) => i.severity === "medium").length,
        Low: results.value.filter((i) => i.severity === "low").length,
      };

      return {
        labels: Object.keys(severityCounts),
        datasets: [
          {
            backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
            data: Object.values(severityCounts),
            borderWidth: 0,
          },
        ],
      };
    });

    return {
      chartOptions,
      categoryChartData,
      severityChartData,
    };
  },
});
</script>
