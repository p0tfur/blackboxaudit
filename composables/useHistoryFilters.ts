import { ref, computed } from 'vue'

type SortField = 'date' | 'issues' | 'severity'
type SortOrder = 'asc' | 'desc'
type SeverityFilter = 'all' | 'high' | 'medium' | 'low'

export const useHistoryFilters = () => {
  const sortField = ref<SortField>('date')
  const sortOrder = ref<SortOrder>('desc')
  const severityFilter = ref<SeverityFilter>('all')
  const searchQuery = ref('')

  const applySorting = <T extends { date: string; results: Array<{ severity: string }> }>(
    items: T[]
  ) => {
    return [...items].sort((a, b) => {
      if (sortField.value === 'date') {
        return sortOrder.value === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      
      if (sortField.value === 'issues') {
        return sortOrder.value === 'desc'
          ? b.results.length - a.results.length
          : a.results.length - b.results.length
      }
      
      if (sortField.value === 'severity') {
        const getSeverityScore = (results: Array<{ severity: string }>) => {
          const scores = { high: 3, medium: 2, low: 1 }
          return Math.max(...results.map(r => scores[r.severity as keyof typeof scores] || 0))
        }
        return sortOrder.value === 'desc'
          ? getSeverityScore(b.results) - getSeverityScore(a.results)
          : getSeverityScore(a.results) - getSeverityScore(b.results)
      }
      
      return 0
    })
  }

  const applyFilters = <T extends { url: string; results: Array<{ severity: string }> }>(
    items: T[]
  ) => {
    return items.filter(item => {
      const matchesSeverity =
        severityFilter.value === 'all' ||
        item.results.some(r => r.severity === severityFilter.value)

      const matchesSearch =
        searchQuery.value === '' ||
        item.url.toLowerCase().includes(searchQuery.value.toLowerCase())

      return matchesSeverity && matchesSearch
    })
  }

  return {
    sortField,
    sortOrder,
    severityFilter,
    searchQuery,
    applySorting,
    applyFilters
  }
}