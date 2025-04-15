// Local storage key
const STORAGE_KEY = "code-comparison-survey-responses"

// Save responses to local storage
export function saveResponses(responses: Record<string, any>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses))
  }
}

// Get responses from local storage
export function getResponses(): Record<string, any> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  }
  return {}
}

// Clear all responses
export function clearResponses(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
