export const GA_TRACKING_ID = "G-KK8LJK03HX"

type GtagWindow = Window & {
  gtag?: (command: "event", action: string, params?: Record<string, unknown>) => void
}

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined") {
    ;(window as GtagWindow).gtag?.("event", action, params)
  }
}
