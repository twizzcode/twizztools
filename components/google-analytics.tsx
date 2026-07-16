"use client"

import Script from "next/script"

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  const gaId = "G-KK8LJK03HX"

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        async
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src="https://umami-twizz.netlify.app/script.js"
        data-website-id="236b6645-7a5b-4ca3-a0d7-4dce87b06f9c"
      />
    </>
  )
}
