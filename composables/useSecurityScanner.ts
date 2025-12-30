import { computed } from "vue";
import { useScanStore, type ScanResult, type ScanSeverity } from "~/stores/scan";
import { scanWebsite } from "~/services/securityScanner";
import { useNotifications } from "~/composables/useNotifications";

const normalizeUrl = (rawUrl: string) => {
  if (!rawUrl) {
    return "";
  }
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const useSecurityScanner = () => {
  const store = useScanStore();
  const notifications = useNotifications();

  const canStartScan = computed(() => !!store.url && !store.isScanning);

  const startScan = async (targetUrl?: string) => {
    const normalizedInput = normalizeUrl(targetUrl ?? store.url);
    if (!normalizedInput) {
      const message = "Please enter a valid URL to start the scan.";
      store.setError(message);
      notifications.error(message);
      return;
    }

    store.setUrl(normalizedInput);
    store.startScan();

    if (!store.isScanning) {
      if (store.error) {
        notifications.error(store.error);
      }
      return;
    }

    notifications.info("Starting security scan...", { title: "Scanning" });

    try {
      store.updateProgress(10);
      const scanResult = await scanWebsite(normalizedInput);

      store.updateProgress(60);
      const normalizedResults: ScanResult[] =
        scanResult.results.length > 0
          ? scanResult.results
          : [
              {
                name: "No Security Issues Found",
                severity: "low" as ScanSeverity,
                recommendation: "Your website appears secure. Continue monitoring for new vulnerabilities.",
                category: "information",
              },
            ];

      store.setResults(normalizedResults);
      store.updateProgress(90);
      store.finishScan({
        scanDuration: scanResult.scanDuration,
        url: scanResult.url,
      });

      notifications.success("Scan completed successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred during scanning.";
      store.setError(message);
      notifications.error(message);
    }
  };

  return {
    canStartScan,
    startScan,
  };
};
