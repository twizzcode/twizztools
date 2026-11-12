import Script from "next/script"

export function GoogleTagManager() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <>
      <Script id="google-tag-manager-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
      </Script>
      <Script
        async
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-M2K8H3S3"
      />
    </>
  )
}
