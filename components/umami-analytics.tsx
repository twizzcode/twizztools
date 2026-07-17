import Script from "next/script"

export function UmamiAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <Script
      strategy="afterInteractive"
      src="https://umami-twizz.netlify.app/script.js"
      data-website-id="236b6645-7a5b-4ca3-a0d7-4dce87b06f9c"
    />
  )
}
