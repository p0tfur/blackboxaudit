import { ref, computed } from "vue";

interface ScanLimits {
  maxScans: number;
  currentCount: number;
  isLimitReached: boolean;
}

export const useScanLimits = () => {
  const maxScans = ref(100);
  const currentCount = ref(0);

  const hasWindow = typeof window !== "undefined";

  // Load current scan count from localStorage
  const loadScanCount = () => {
    if (!hasWindow) return;

    const savedCount = window.localStorage.getItem("scan_count");
    if (savedCount) {
      currentCount.value = parseInt(savedCount, 10);
    }
  };

  // Save current scan count to localStorage
  const saveScanCount = () => {
    if (!hasWindow) return;

    window.localStorage.setItem("scan_count", currentCount.value.toString());
  };

  // Increment scan count
  const incrementScanCount = () => {
    if (currentCount.value < maxScans.value) {
      currentCount.value++;
      saveScanCount();
    }
  };

  // Reset scan count
  const resetScanCount = () => {
    currentCount.value = 0;
    saveScanCount();
  };

  // Check if scan limit is reached
  const isLimitReached = computed(() => {
    return currentCount.value >= maxScans.value;
  });

  // Get remaining scans
  const remainingScans = computed(() => {
    return Math.max(0, maxScans.value - currentCount.value);
  });

  // Initialize
  loadScanCount();

  return {
    maxScans,
    currentCount,
    isLimitReached,
    remainingScans,
    incrementScanCount,
    resetScanCount,
  };
};
