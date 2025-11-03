<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold mb-4">Security Analysis</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg mb-2">Issues by Category</h3>
        <div class="h-64">
          <PieChart :data="categoryChartData" :options="chartOptions" />
        </div>
      </div>
      <div>
        <h3 class="text-lg mb-2">Severity Distribution</h3>
        <div class="h-64">
          <DoughnutChart :data="severityChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useScanStore } from '../stores/scan'
import { Pie as PieChart, Doughnut as DoughnutChart } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  name: 'SecurityCharts',
  components: {
    PieChart,
    DoughnutChart
  },
  setup() {
    const store = useScanStore()
    const { results } = storeToRefs(store)

    // Chart options
    const chartOptions = computed<ChartOptions<'pie' | 'doughnut'>>(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }))

    // Categories chart data
    const categoryChartData = computed(() => {
      const categories: Record<string, number> = {
        'Headers': 0,
        'Transport': 0,
        'Content': 0,
        'Forms': 0,
        'Other': 0
      }
      
      results.value.forEach(issue => {
        // Simple categorization based on issue name
        if (issue.name.toLowerCase().includes('header')) categories['Headers']++
        else if (issue.name.toLowerCase().includes('https') || issue.name.toLowerCase().includes('transport')) categories['Transport']++
        else if (issue.name.toLowerCase().includes('form')) categories['Forms']++
        else if (issue.name.toLowerCase().includes('javascript') || issue.name.toLowerCase().includes('content')) categories['Content']++
        else categories['Other']++
      })
      
      return {
        labels: Object.keys(categories),
        datasets: [{
          backgroundColor: ['#4B5563', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
          data: Object.values(categories)
        }]
      }
    })

    // Severity chart data
    const severityChartData = computed(() => {
      const severityCounts = {
        'High': results.value.filter(i => i.severity === 'high').length,
        'Medium': results.value.filter(i => i.severity === 'medium').length,
        'Low': results.value.filter(i => i.severity === 'low').length
      }
      
      return {
        labels: Object.keys(severityCounts),
        datasets: [{
          backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6'],
          data: Object.values(severityCounts)
        }]
      }
    })

    return {
      chartOptions,
      categoryChartData,
      severityChartData
    }
  }
})
</script>