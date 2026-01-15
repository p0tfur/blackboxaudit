import { defineStore } from "pinia";
import { useScanLimits } from "~/composables/useScanLimits";

export type ScanSeverity = "low" | "medium" | "high";
export type ScanCategory =
  | "transport"
  | "headers"
  | "content"
  | "cookies"
  | "forms"
  | "information"
  | "third-party"
  | "reputation"
  | "other";

export interface ScanResult {
  name: string;
  severity: ScanSeverity;
  recommendation: string;
  category?: ScanCategory;
}

export interface ScanHistoryEntry {
  id: string;
  url: string;
  date: string;
  results: ScanResult[];
  score: number;
  scanDuration: number;
}

interface ScanState {
  url: string;
  isScanning: boolean;
  progress: number;
  results: ScanResult[];
  error: string | null;
  score: number;
  scanDate: string | null;
  scanDuration: number | null;
  history: ScanHistoryEntry[];
  historyLoaded: boolean;
}

export const useScanStore = defineStore("scan", {
  state: (): ScanState => ({
    url: "",
    isScanning: false,
    progress: 0,
    results: [],
    error: null,
    score: 100,
    scanDate: null,
    scanDuration: null,
    history: [],
    historyLoaded: false,
  }),

  actions: {
    setUrl(url: string) {
      this.url = url;
    },

    startScan() {
      const scanLimits = useScanLimits();
      if (scanLimits.isLimitReached.value) {
        this.error = "Scan limit reached. Please try again later.";
        return;
      }

      this.isScanning = true;
      this.progress = 0;
      this.results = [];
      this.error = null;
      this.scanDate = new Date().toISOString();
      this.scanDuration = null;
      scanLimits.incrementScanCount();
    },

    updateProgress(progress: number) {
      this.progress = progress;
    },

    setResults(results: ScanResult[]) {
      this.results = results;
    },

    addResult(result: ScanResult) {
      this.results = [...this.results, result];
    },

    setError(error: string) {
      this.error = error;
      this.isScanning = false;
    },

    finishScan(payload?: { scanDuration: number; url?: string }) {
      this.isScanning = false;
      this.progress = 100;
      if (payload?.url) {
        this.url = payload.url;
      }
      if (payload?.scanDuration != null) {
        this.scanDuration = payload.scanDuration;
      }
      this.scanDate = new Date().toISOString();
      
      this.deduplicateResults();
      this.calculateScore();
      this.recordHistoryEntry();
    },

    deduplicateResults() {
      // Create a map to store unique results by their normalized name
      const uniqueResults = new Map<string, ScanResult>();
      
      for (const result of this.results) {
        // Skip purely informational "issues" that look like duplicates
        if (result.name === "No Security Issues Found") continue;
        
        let baseName = result.name
          .replace(/\s+on\s+https?:\/\/[^\s]+/gi, '')
          .replace(/\s+\(Form #\d+\)/gi, '')
          .replace(/Cookie\s+\S+\s+missing/gi, 'Cookie missing')
          .trim();
          
        // Use the simplified name for the result to show in UI
        const cleanResult = {
          ...result,
          name: baseName // Overwrite complex name with simple name
        };
        
        // Only keep the first occurrence of this issue type
        if (!uniqueResults.has(baseName)) {
          uniqueResults.set(baseName, cleanResult);
        }
      }
      
      // If we found issues, replace results. If empty (only "No issues found"), keep original or empty.
      if (uniqueResults.size > 0) {
        this.results = Array.from(uniqueResults.values());
      } else if (this.results.some(r => r.name === "No Security Issues Found")) {
         // Keep the "No issues found" marker if it was there and nothing else matched
         this.results = [{ name: "No Security Issues Found", severity: "low", recommendation: "Great job!" }];
      } else if (this.results.length > 0) {
         // Fallback usually shouldn't happen unless everything was filtered out
         this.results = [];
      }
    },

    calculateScore() {
      // Very lenient severity weights - most issues are minor
      const severityWeights: Record<ScanSeverity, number> = {
        high: 3,
        medium: 1.5,
        low: 0.5,
      };

      // Category importance - transport/SSL is critical, headers less so
      const categoryMultipliers: Record<ScanCategory, number> = {
        transport: 1.5,
        headers: 0.5,     // Headers are very common, don't penalize much
        content: 0.8,
        cookies: 0.6,
        forms: 0.4,
        information: 0.3, // Info disclosure is basically noise
        "third-party": 0.4,
        reputation: 1.2,  // Reputation issues are important
        other: 0.3,
      };

      if (this.results.length === 0 || (this.results.length === 1 && this.results[0].name === "No Security Issues Found")) {
        this.score = 100;
        return;
      }

      // Calculate penalty with aggressive capping on ALREADY DEDUPLICATED results
      const categoryPenalties: Partial<Record<ScanCategory, number>> = {};
      const maxPenaltyPerCategory = 12; // Very low cap

      for (const issue of this.results) {
        // Skip informative items in score calc
        if (issue.name.includes("Security.txt Found") || issue.name.includes("Robots.txt Found")) {
           continue;
        }

        const severityWeight = severityWeights[issue.severity];
        const multiplier = categoryMultipliers[issue.category ?? "other"];
        const penalty = severityWeight * multiplier;
        
        const current = categoryPenalties[issue.category ?? "other"] ?? 0;
        categoryPenalties[issue.category ?? "other"] = Math.min(current + penalty, maxPenaltyPerCategory);
      }

      const totalPenalty = Object.values(categoryPenalties).reduce((acc, p) => acc + p, 0);

      // Score: max penalty ~60 points, minimum score 35
      this.score = Math.max(35, Math.round(100 - totalPenalty));
    },

    recordHistoryEntry() {
      if (typeof window === "undefined" || !this.scanDate) {
        return;
      }

      if (!this.historyLoaded) {
        this.loadHistory();
      }

      const entryId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `scan-${Date.now()}`;

      const entry: ScanHistoryEntry = {
        id: entryId,
        url: this.url,
        date: this.scanDate,
        results: this.results.map((result) => ({ ...result })),
        score: this.score,
        scanDuration: this.scanDuration ?? 0,
      };

      this.history = [entry, ...this.history].slice(0, 50);
      this.persistHistory();
    },

    persistHistory() {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.setItem("scan_history", JSON.stringify(this.history));
    },

    loadHistory() {
      if (this.historyLoaded || typeof window === "undefined") {
        return;
      }

      const stored = localStorage.getItem("scan_history");
      if (stored) {
        try {
          this.history = JSON.parse(stored);
        } catch (error) {
          console.error("Failed to parse scan history from localStorage", error);
          this.history = [];
        }
      }
      this.historyLoaded = true;
    },

    loadHistoryEntry(entry: ScanHistoryEntry) {
      this.url = entry.url;
      this.results = entry.results;
      this.score = entry.score;
      this.scanDate = entry.date;
      this.scanDuration = entry.scanDuration;
      this.error = null;
    },
  },
});
