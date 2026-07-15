const STORAGE_KEY = "captionGenerator_usage"
const DAILY_LIMIT = 5

export type RateLimitStatus = {
  allowed: boolean
  remaining: number
  resetDate: string
}

export function checkRateLimit(): RateLimitStatus {
  if (typeof window === "undefined") {
    return { allowed: true, remaining: DAILY_LIMIT, resetDate: getTodayDate() }
  }

  const data = localStorage.getItem(STORAGE_KEY)
  const today = getTodayDate()

  if (!data) {
    return { allowed: true, remaining: DAILY_LIMIT, resetDate: today }
  }

  try {
    const parsed = JSON.parse(data)

    if (parsed.date !== today) {
      return { allowed: true, remaining: DAILY_LIMIT, resetDate: today }
    }

    const count = parsed.count || 0
    const remaining = Math.max(0, DAILY_LIMIT - count)

    return {
      allowed: count < DAILY_LIMIT,
      remaining,
      resetDate: today,
    }
  } catch {
    return { allowed: true, remaining: DAILY_LIMIT, resetDate: today }
  }
}

export function incrementUsage(): void {
  if (typeof window === "undefined") return

  const today = getTodayDate()
  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: 1 })
    )
    return
  }

  try {
    const parsed = JSON.parse(data)

    if (parsed.date !== today) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: today, count: 1 })
      )
    } else {
      const newCount = (parsed.count || 0) + 1
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: today, count: newCount })
      )
    }
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: 1 })
    )
  }
}

export function resetUsage(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}
