export const GA_TRACKING_ID = "G-KK8LJK03HX"

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}

export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params)
  }
}
