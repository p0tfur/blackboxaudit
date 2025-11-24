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
      this.calculateScore();
      this.recordHistoryEntry();
    },

    calculateScore() {
      const severityWeights: Record<ScanSeverity, number> = {
        high: 30,
        medium: 15,
        low: 5,
      };

      const categoryMultipliers: Record<ScanCategory, number> = {
        transport: 1.2,
        headers: 1,
        content: 1,
        cookies: 1.1,
        forms: 1,
        information: 0.8,
        "third-party": 0.9,
        other: 0.7,
      };

      if (this.results.length === 0) {
        this.score = 100;
        return;
      }

      const maxPenaltyPerCategory = 35;
      const categoryPenalties: Partial<Record<ScanCategory, number>> = {};

      for (const issue of this.results) {
        if (issue.name === "No Security Issues Found") {
          continue;
        }

        const severityWeight = severityWeights[issue.severity];
        const category = issue.category ?? "other";
        const multiplier = categoryMultipliers[category];
        const penalty = severityWeight * multiplier;
        const current = categoryPenalties[category] ?? 0;
        categoryPenalties[category] = Math.min(current + penalty, maxPenaltyPerCategory * multiplier);
      }

      const totalPenalty = Object.values(categoryPenalties).reduce((acc, penalty) => acc + penalty, 0);

      // Higher score means more secure website (100 = perfect)
      this.score = Math.max(0, 100 - Math.min(100, totalPenalty));
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
