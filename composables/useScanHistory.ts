import { ref, computed } from 'vue'
import { useScanStore } from '~/stores/scan'

interface ScanHistoryItem {
  id: string
  url: string
  date: string
  results: {
    name: string
    severity: 'low' | 'medium' | 'high'
    recommendation: string
  }[]
  score: number
}

export const useScanHistory = () => {
  const store = useScanStore()
  const history = ref<ScanHistoryItem[]>([])

  // Load history from localStorage
  const loadHistory = () => {
    const savedHistory = localStorage.getItem('scan_history')
    if (savedHistory) {
      history.value = JSON.parse(savedHistory)
    }
  }

  // Save history to localStorage
  const saveHistory = () => {
    localStorage.setItem('scan_history', JSON.stringify(history.value))
  }

  // Add new scan to history
  const addScan = (scan: Omit<ScanHistoryItem, 'id'>) => {
    const scanWithId = {
      ...scan,
      id: crypto.randomUUID()
    }
    history.value.unshift(scanWithId)
    if (history.value.length > 10) {
      history.value.pop()
    }
    saveHistory()
  }

  // Calculate statistics
  const statistics = computed(() => {
    if (history.value.length === 0) return null

    const totalScans = history.value.length
    const averageScore = history.value.reduce((acc, scan) => acc + scan.score, 0) / totalScans

    const severityCounts = history.value.reduce((acc, scan) => {
      scan.results.forEach(result => {
        acc[result.severity] = (acc[result.severity] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return {
      totalScans,
      averageScore,
      severityCounts,
      recentScans: history.value.slice(0, 5)
    }
  })

  // Initialize
  loadHistory()

  return {
    history,
    statistics,
    addScan,
    loadHistory,
    saveHistory
  }
}