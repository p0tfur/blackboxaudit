import { defineStore } from 'pinia'
import { useScanLimits } from '~/composables/useScanLimits'

export interface ScanResult {
  name: string
  severity: 'low' | 'medium' | 'high'
  recommendation: string
}

interface ScanState {
  url: string
  isScanning: boolean
  progress: number
  results: ScanResult[]
  error: string | null
  score: number
  scanDate: string | null
}

export const useScanStore = defineStore('scan', {
  state: (): ScanState => ({
    url: '',
    isScanning: false,
    progress: 0,
    results: [],
    error: null,
    score: 100,
    scanDate: null
  }),

  actions: {
    setUrl(url: string) {
      this.url = url
    },

    startScan() {
      const scanLimits = useScanLimits()
      if (scanLimits.isLimitReached.value) {
        this.error = 'Scan limit reached. Please try again later.'
        return
      }
      
      this.isScanning = true
      this.progress = 0
      this.results = []
      this.error = null
      this.scanDate = new Date().toISOString()
      scanLimits.incrementScanCount()
    },

    updateProgress(progress: number) {
      this.progress = progress
    },

    addResult(result: ScanResult) {
      this.results.push(result)
    },

    setError(error: string) {
      this.error = error
      this.isScanning = false
    },

    finishScan() {
      this.isScanning = false
      this.progress = 100
      this.calculateScore()
    },

    calculateScore() {
      const weights = {
        high: 20,
        medium: 10,
        low: 5
      }

      if (this.results.length === 0) {
        this.score = 100
        return
      }

      const weightedScore = this.results.reduce((acc, issue) => {
        return acc + (weights[issue.severity] || 0)
      }, 0)

      // Higher score means more secure website (100 = perfect)
      this.score = Math.max(0, 100 - Math.min(100, weightedScore))
    }
  }
})