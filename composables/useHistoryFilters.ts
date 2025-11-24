import { ref, watch } from "vue";

type SortField = "date" | "issues" | "severity";
type SortOrder = "asc" | "desc";
type SeverityFilter = "all" | "high" | "medium" | "low";

const getStoredValue = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const stored = window.localStorage.getItem(key);
  return stored ? (stored as T) : fallback;
};

const sortField = ref<SortField>(getStoredValue("scan_sort_field", "date"));
const sortOrder = ref<SortOrder>(getStoredValue("scan_sort_order", "desc"));
const severityFilter = ref<SeverityFilter>(getStoredValue("scan_severity_filter", "all"));
const searchQuery = ref("");

if (typeof window !== "undefined") {
  watch(sortField, (value) => {
    window.localStorage.setItem("scan_sort_field", value);
  });

  watch(sortOrder, (value) => {
    window.localStorage.setItem("scan_sort_order", value);
  });

  watch(severityFilter, (value) => {
    window.localStorage.setItem("scan_severity_filter", value);
  });
}

export const useHistoryFilters = () => {
  const applySorting = <T extends { date: string; results: Array<{ severity: string }> }>(items: T[]) => {
    return [...items].sort((a, b) => {
      if (sortField.value === "date") {
        return sortOrder.value === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      if (sortField.value === "issues") {
        return sortOrder.value === "desc" ? b.results.length - a.results.length : a.results.length - b.results.length;
      }

      if (sortField.value === "severity") {
        const getSeverityScore = (results: Array<{ severity: string }>) => {
          const scores = { high: 3, medium: 2, low: 1 };
          return Math.max(...results.map((result) => scores[result.severity as keyof typeof scores] || 0));
        };
        return sortOrder.value === "desc"
          ? getSeverityScore(b.results) - getSeverityScore(a.results)
          : getSeverityScore(a.results) - getSeverityScore(b.results);
      }

      return 0;
    });
  };

  const applyFilters = <T extends { url: string; results: Array<{ severity: string }> }>(items: T[]) => {
    return items.filter((item) => {
      const matchesSeverity =
        severityFilter.value === "all" || item.results.some((result) => result.severity === severityFilter.value);

      const matchesSearch =
        searchQuery.value === "" || item.url.toLowerCase().includes(searchQuery.value.toLowerCase());

      return matchesSeverity && matchesSearch;
    });
  };

  return {
    sortField,
    sortOrder,
    severityFilter,
    searchQuery,
    applySorting,
    applyFilters,
  };
};
