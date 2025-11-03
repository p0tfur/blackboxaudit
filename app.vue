<template>
  <div class="min-h-screen bg-gray-100">
    <Navigation />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useScanStore } from './stores/scan'

const store = useScanStore()
const { url, isScanning, progress, results, error } = storeToRefs(store)

const startScan = async () => {
  try {
    store.startScan()
    // TODO: Implement actual scanning logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    store.finishScan()
  } catch (err) {
    store.setError(err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
</script>
